#!/usr/bin/env python3
"""
Script: Re-indexação completa no Pinecone com EF+EM
Execute: python scripts/05_reindex_complete.py
"""

import json
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict
import time

load_dotenv()

class PineconeCompleteReindexer:
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "bncc-planeja")
        self.dimension = 384
        
        if not self.api_key:
            raise ValueError("PINECONE_API_KEY não encontrada")
        
        print(f"🔑 Conectando ao Pinecone...")
        self.pc = Pinecone(api_key=self.api_key)
        print("✅ Conectado ao Pinecone!")
        
    def recreate_index(self):
        """Recria índice para base completa"""
        
        # Deletar índice existente
        existing_indexes = [index.name for index in self.pc.list_indexes()]
        
        if self.index_name in existing_indexes:
            print(f"🗑️  Deletando índice existente '{self.index_name}'...")
            self.pc.delete_index(self.index_name)
            
            while self.index_name in [index.name for index in self.pc.list_indexes()]:
                print("   ⏳ Aguardando deleção...")
                time.sleep(2)
            
            print("✅ Índice deletado!")
        
        # Criar novo índice
        print(f"🔄 Criando novo índice '{self.index_name}'...")
        
        self.pc.create_index(
            name=self.index_name,
            dimension=self.dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        
        # Aguardar índice ficar ativo
        print("⏳ Aguardando índice ficar ativo...")
        while True:
            index_description = self.pc.describe_index(self.index_name)
            if index_description.status.ready:
                break
            time.sleep(5)
        
        print("✅ Novo índice criado e ativo!")
        return self.pc.Index(self.index_name)
    
    def prepare_vectors_complete(self, chunks_with_embeddings: List[Dict]) -> List[Dict]:
        """Prepara vetores da base completa"""
        
        print("🔄 Preparando vetores completos...")
        
        vectors = []
        ef_count = 0
        em_count = 0
        outros_count = 0
        
        for chunk in chunks_with_embeddings:
            # Verificar ID ASCII
            try:
                chunk["id"].encode('ascii')
            except UnicodeEncodeError:
                print(f"⚠️  ID não-ASCII encontrado: {chunk['id']}")
                continue
            
            # Preparar metadata otimizada
            metadata = {
                "type": chunk["type"],
                "content": chunk["content"][:700],  # Reduzir para caber mais dados
                "area": chunk["metadata"].get("area", "")[:50],
                "etapa": chunk["metadata"].get("etapa", "")[:30],
                "adaptavel_eja": chunk["metadata"].get("adaptavel_eja", True),
                "fonte": chunk["metadata"].get("fonte", "bncc")[:30]
            }
            
            # Campos específicos por tipo
            if chunk["type"] == "competencia_geral":
                metadata["comp_num"] = chunk["metadata"].get("competencia_numero", 0)
            elif "habilidades" in chunk["type"]:
                metadata["ano"] = chunk["metadata"].get("ano", "")[:20]
                codigos = chunk["metadata"].get("codigos_habilidades", [])
                metadata["codigos"] = ",".join(codigos[:3])[:60]  # Máximo 3 códigos
                
                # Contar por etapa
                if chunk["metadata"].get("etapa") == "ensino_fundamental":
                    ef_count += 1
                elif chunk["metadata"].get("etapa") == "ensino_medio":
                    em_count += 1
                else:
                    outros_count += 1
            
            vector = {
                "id": chunk["id"],
                "values": chunk["embedding"],
                "metadata": metadata
            }
            
            vectors.append(vector)
        
        print(f"📊 Vetores preparados por etapa:")
        print(f"  - Ensino Fundamental: {ef_count}")
        print(f"  - Ensino Médio: {em_count}")
        print(f"  - Outros/Gerais: {outros_count}")
        print(f"  - Total: {len(vectors)}")
        
        return vectors
    
    def index_vectors_complete(self, chunks_with_embeddings: List[Dict]):
        """Indexa vetores completos no Pinecone"""
        
        # Recriar índice
        index = self.recreate_index()
        
        # Preparar vetores
        vectors = self.prepare_vectors_complete(chunks_with_embeddings)
        
        if not vectors:
            print("❌ Nenhum vetor válido!")
            return None
        
        # Indexar em batches
        batch_size = 50
        total_batches = (len(vectors) + batch_size - 1) // batch_size
        successful_batches = 0
        
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            batch_num = i // batch_size + 1
            
            print(f"🔄 Indexando batch {batch_num}/{total_batches} ({len(batch)} vetores)")
            
            try:
                index.upsert(vectors=batch)
                print(f"  ✅ Batch {batch_num} indexado com sucesso")
                successful_batches += 1
                time.sleep(1)  # Pausa entre batches
                
            except Exception as e:
                print(f"  ❌ Erro no batch {batch_num}: {e}")
                continue
        
        # Aguardar indexação
        print("⏳ Aguardando indexação completar...")
        time.sleep(15)
        
        # Verificar estatísticas
        stats = index.describe_index_stats()
        print(f"📊 Estatísticas finais:")
        print(f"  - Total de vetores: {stats['total_vector_count']}")
        print(f"  - Dimensões: {stats['dimension']}")
        print(f"  - Batches bem-sucedidos: {successful_batches}/{total_batches}")
        
        return index
    
    def test_search_complete(self, index):
        """Teste completo de busca EF+EM"""
        
        print(f"\n🔍 Testando busca completa...")
        
        queries = [
            "matemática ensino fundamental EJA",
            "português jovens adultos",
            "ensino médio linguagens tecnologias", 
            "ciências natureza EM",
            "projeto vida trabalho",
            "competências gerais BNCC"
        ]
        
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
            
            all_tests_passed = True
            
            for query in queries:
                print(f"\n🔍 Query: '{query}'")
                
                query_embedding = model.encode([query], normalize_embeddings=True)[0].tolist()
                
                results = index.query(
                    vector=query_embedding,
                    top_k=3,
                    include_metadata=True
                )
                
                if results.matches:
                    print(f"  📊 {len(results.matches)} resultados:")
                    for i, match in enumerate(results.matches):
                        area = match.metadata.get('area', 'N/A')
                        etapa = match.metadata.get('etapa', 'N/A')
                        tipo = match.metadata.get('type', 'N/A')
                        print(f"    {i+1}. Score: {match.score:.3f} | {tipo} | {area} | {etapa}")
                else:
                    print(f"  ❌ Nenhum resultado")
                    all_tests_passed = False
            
            return all_tests_passed
            
        except Exception as e:
            print(f"❌ Erro no teste: {e}")
            return False

def main():
    print("🚀 RE-INDEXAÇÃO COMPLETA PINECONE (EF+EM)\n")
    
    # Carregar chunks com embeddings
    input_file = "data/processed/bncc_chunks_complete_embeddings.json"
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        print("   Execute primeiro: python scripts/04_generate_embeddings_complete.py")
        return
    
    print(f"📥 Carregando chunks completos...")
    with open(input_file, "r", encoding="utf-8") as f:
        chunks_with_embeddings = json.load(f)
    
    print(f"📊 Carregados {len(chunks_with_embeddings)} chunks")
    
    # Re-indexar
    try:
        indexer = PineconeCompleteReindexer()
        index = indexer.index_vectors_complete(chunks_with_embeddings)
        
        if index:
            # Teste de busca
            if indexer.test_search_complete(index):
                print(f"\n🎉 RE-INDEXAÇÃO COMPLETA FINALIZADA!")
                print(f"🔗 Índice: {indexer.index_name}")
                print(f"📊 Base BNCC completa (EF+EM) indexada!")
                print(f"🎯 Pronta para gerar planos de aula completos!")
            else:
                print(f"\n⚠️  Indexação concluída mas alguns testes falharam")
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    main()