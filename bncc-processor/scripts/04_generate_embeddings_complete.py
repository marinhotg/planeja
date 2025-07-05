#!/usr/bin/env python3
"""
Script: Geração de embeddings para base completa EF+EM
Execute: python scripts/04_generate_embeddings_complete.py
"""

import json
import os
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict

class BNCCCompleteEmbeddingGenerator:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        print(f"🔄 Carregando modelo {model_name}...")
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name
        print("✅ Modelo carregado com sucesso!")
    
    def generate_embeddings(self, chunks: List[Dict]) -> List[Dict]:
        """Gera embeddings para base completa EF+EM"""
        
        print(f"🧠 Gerando embeddings para {len(chunks)} chunks...")
        
        # Separar por tipo para análise
        types_count = {}
        for chunk in chunks:
            chunk_type = chunk["type"]
            types_count[chunk_type] = types_count.get(chunk_type, 0) + 1
        
        print(f"  📊 Distribuição por tipo:")
        for chunk_type, count in sorted(types_count.items()):
            print(f"     - {chunk_type}: {count}")
        
        # Extrair textos
        texts = []
        for chunk in chunks:
            full_text = f"{chunk['type']}: {chunk['content']}"
            texts.append(full_text)
        
        # Gerar embeddings
        print("  🔄 Processando embeddings...")
        embeddings = self.model.encode(
            texts, 
            batch_size=16,
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        
        print(f"  ✅ Embeddings gerados: {embeddings.shape}")
        
        # Adicionar embeddings aos chunks
        chunks_with_embeddings = []
        for i, chunk in enumerate(chunks):
            chunk_with_embedding = chunk.copy()
            chunk_with_embedding["embedding"] = embeddings[i].tolist()
            chunk_with_embedding["embedding_model"] = self.model_name
            chunk_with_embedding["embedding_dimensions"] = len(embeddings[i])
            chunks_with_embeddings.append(chunk_with_embedding)
        
        return chunks_with_embeddings
    
    def test_similarity_complete(self, chunks_with_embeddings: List[Dict]):
        """Teste de similaridade para base completa"""
        
        # Queries de teste específicas para EF+EM
        test_queries = [
            "matemática ensino fundamental",
            "português EJA adultos", 
            "ensino médio linguagens",
            "ciências natureza tecnologias",
            "projeto vida jovens",
            "mundo trabalho EM"
        ]
        
        print(f"\n🔍 Testando busca semântica...")
        
        for query in test_queries:
            print(f"\n  Query: '{query}'")
            
            # Gerar embedding da query
            query_embedding = self.model.encode([query], normalize_embeddings=True)[0]
            
            # Calcular similaridades
            similarities = []
            for chunk in chunks_with_embeddings:
                chunk_embedding = np.array(chunk["embedding"])
                similarity = np.dot(query_embedding, chunk_embedding)
                similarities.append((similarity, chunk))
            
            # Top 2 resultados
            similarities.sort(key=lambda x: x[0], reverse=True)
            
            for i, (score, chunk) in enumerate(similarities[:2]):
                tipo = chunk['type']
                area = chunk['metadata'].get('area', 'N/A')
                etapa = chunk['metadata'].get('etapa', 'N/A')
                print(f"    {i+1}. Score: {score:.3f} | {tipo} | {area} | {etapa}")

def main():
    print("🚀 GERAÇÃO DE EMBEDDINGS COMPLETOS EF+EM\n")
    
    # Carregar chunks completos
    input_file = "data/processed/bncc_chunks_complete.json"
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        print("   Execute primeiro: python scripts/03_create_chunks_complete.py")
        return
    
    with open(input_file, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    
    print(f"📊 Carregados {len(chunks)} chunks")
    
    # Gerar embeddings
    embedding_generator = BNCCCompleteEmbeddingGenerator()
    chunks_with_embeddings = embedding_generator.generate_embeddings(chunks)
    
    # Salvar
    output_file = "data/processed/bncc_chunks_complete_embeddings.json"
    
    print(f"💾 Salvando chunks com embeddings...")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chunks_with_embeddings, f, ensure_ascii=False, indent=2)
    
    size_mb = os.path.getsize(output_file) / (1024 * 1024)
    print(f"✅ Arquivo salvo: {output_file} ({size_mb:.1f} MB)")
    
    # Teste de similaridade
    embedding_generator.test_similarity_complete(chunks_with_embeddings)
    
    print(f"\n🎉 Embeddings completos gerados!")
    print(f"📊 Total de chunks: {len(chunks_with_embeddings)}")
    print(f"📊 Dimensões: {chunks_with_embeddings[0]['embedding_dimensions']}")
    
    # Estatísticas por etapa
    ef_chunks = len([c for c in chunks_with_embeddings if c['metadata'].get('etapa') == 'ensino_fundamental'])
    em_chunks = len([c for c in chunks_with_embeddings if c['metadata'].get('etapa') == 'ensino_medio'])
    outros = len(chunks_with_embeddings) - ef_chunks - em_chunks
    
    print(f"📊 Por etapa:")
    print(f"  - Ensino Fundamental: {ef_chunks}")
    print(f"  - Ensino Médio: {em_chunks}")
    print(f"  - Outros/Gerais: {outros}")

if __name__ == "__main__":
    main()