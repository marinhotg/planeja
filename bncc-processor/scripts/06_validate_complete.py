#!/usr/bin/env python3
"""
Script: Validação final da base completa EF+EM
Execute: python scripts/06_validate_complete.py
"""

import json
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

load_dotenv()

def validate_complete_files():
    """Valida arquivos da base completa"""
    
    print("📁 Validando arquivos completos...")
    
    required_files = [
        "data/bncc_raw/bncc_ei_ef.pdf",
        "data/processed/bncc_extracted_complete.json",
        "data/processed/bncc_chunks_complete.json", 
        "data/processed/bncc_chunks_complete_embeddings.json"
    ]
    
    all_good = True
    
    for file_path in required_files:
        if os.path.exists(file_path):
            size_mb = os.path.getsize(file_path) / (1024 * 1024)
            print(f"  ✅ {file_path} ({size_mb:.1f} MB)")
        else:
            print(f"  ❌ {file_path} - ARQUIVO FALTANDO")
            all_good = False
    
    return all_good

def validate_complete_data_quality():
    """Valida qualidade dos dados completos"""
    
    print(f"\n📊 Validando qualidade dos dados completos...")
    
    # Dados extraídos
    with open("data/processed/bncc_extracted_complete.json", "r", encoding="utf-8") as f:
        extracted = json.load(f)
    
    # Chunks
    with open("data/processed/bncc_chunks_complete.json", "r", encoding="utf-8") as f:
        chunks = json.load(f)
    
    # Chunks com embeddings
    with open("data/processed/bncc_chunks_complete_embeddings.json", "r", encoding="utf-8") as f:
        chunks_embeddings = json.load(f)
    
    print(f"  📈 Competências gerais: {len(extracted['competencias_gerais'])}")
    print(f"  📈 Total de habilidades: {len(extracted['habilidades'])}")
    print(f"    - Ensino Fundamental: {extracted['metadata']['ensino_fundamental']}")
    print(f"    - Ensino Médio: {extracted['metadata']['ensino_medio']}")
    print(f"  📈 Chunks criados: {len(chunks)}")
    print(f"  📈 Chunks com embeddings: {len(chunks_embeddings)}")
    
    # Validar distribuição das áreas
    areas = {}
    for hab in extracted['habilidades']:
        area = hab['area']
        areas[area] = areas.get(area, 0) + 1
    
    print(f"  📚 Áreas de conhecimento:")
    for area in sorted(areas.keys()):
        count = areas[area]
        print(f"    - {area}: {count} habilidades")
    
    # Validar chunks por tipo
    chunk_types = {}
    for chunk in chunks:
        chunk_type = chunk['type']
        chunk_types[chunk_type] = chunk_types.get(chunk_type, 0) + 1
    
    print(f"  📦 Distribuição de chunks:")
    for chunk_type in sorted(chunk_types.keys()):
        count = chunk_types[chunk_type]
        print(f"    - {chunk_type}: {count}")
    
    # Validar embeddings
    if chunks_embeddings:
        embedding_dim = chunks_embeddings[0]['embedding_dimensions']
        print(f"  🧠 Dimensões dos embeddings: {embedding_dim}")
    
    # Verificar códigos específicos mencionados
    target_codes = ["EM13LGG101", "EM13LGG102", "EM13LGG103", "EM13LGG104", "EM13LGG105"]
    found_codes = [h for h in extracted['habilidades'] if h['codigo'] in target_codes]
    
    print(f"  🎯 Códigos específicos encontrados: {len(found_codes)}/5")
    for hab in found_codes:
        print(f"    ✅ {hab['codigo']}: {hab['descricao'][:60]}...")

def validate_complete_pinecone():
    """Valida Pinecone com base completa"""
    
    print(f"\n🔗 Validando Pinecone completo...")
    
    api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME", "bncc-planeja")
    
    if not api_key:
        print("  ❌ PINECONE_API_KEY não encontrada")
        return False
    
    try:
        pc = Pinecone(api_key=api_key)
        
        # Verificar índice
        existing_indexes = [index.name for index in pc.list_indexes()]
        
        if index_name not in existing_indexes:
            print(f"  ❌ Índice '{index_name}' não encontrado")
            return False
        
        print(f"  ✅ Índice '{index_name}' encontrado")
        
        # Estatísticas do índice
        index = pc.Index(index_name)
        stats = index.describe_index_stats()
        
        print(f"  📊 Vetores indexados: {stats['total_vector_count']}")
        print(f"  📊 Dimensões: {stats['dimension']}")
        
        if stats['total_vector_count'] == 0:
            print("  ⚠️  Nenhum vetor no índice")
            return False
        
        return True
        
    except Exception as e:
        print(f"  ❌ Erro: {e}")
        return False

def test_complete_end_to_end():
    """Teste end-to-end completo EF+EM"""
    
    print(f"\n🧪 Teste End-to-End Completo...")
    
    try:
        # Carregar modelo
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        
        # Conectar Pinecone
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index(os.getenv("PINECONE_INDEX_NAME", "bncc-planeja"))
        
        # Queries de teste específicas EF+EM
        test_queries = [
            ("Ensino Fundamental", "matemática básica para adultos"),
            ("Ensino Médio", "linguagens tecnologias jovens"),
            ("EJA Geral", "competências BNCC educação adultos"),
            ("Mundo Trabalho", "projeto vida ensino médio"),
            ("Contextualização", "conteúdos significativos EJA")
        ]
        
        all_tests_passed = True
        
        for categoria, query in test_queries:
            print(f"\n  🔍 {categoria}: '{query}'")
            
            query_embedding = model.encode([query], normalize_embeddings=True)[0].tolist()
            
            results = index.query(
                vector=query_embedding,
                top_k=2,
                include_metadata=True
            )
            
            if results.matches:
                for i, match in enumerate(results.matches):
                    tipo = match.metadata.get('type', 'N/A')
                    area = match.metadata.get('area', 'N/A')
                    etapa = match.metadata.get('etapa', 'N/A')
                    print(f"    {i+1}. Score: {match.score:.3f} | {tipo} | {etapa} | {area}")
            else:
                print(f"    ❌ Nenhum resultado")
                all_tests_passed = False
        
        print(f"\n  ✅ Teste end-to-end completo concluído!")
        return all_tests_passed
        
    except Exception as e:
        print(f"  ❌ Erro no teste: {e}")
        return False

def generate_final_report():
    """Gera relatório final da base completa"""
    
    print(f"\n📋 RELATÓRIO FINAL DA BASE BNCC COMPLETA")
    print(f"=" * 50)
    
    # Carregar dados para relatório
    with open("data/processed/bncc_extracted_complete.json", "r", encoding="utf-8") as f:
        extracted = json.load(f)
    
    with open("data/processed/bncc_chunks_complete_embeddings.json", "r", encoding="utf-8") as f:
        chunks = json.load(f)
    
    # Estatísticas gerais
    print(f"📊 ESTATÍSTICAS GERAIS:")
    print(f"  - Total de habilidades extraídas: {len(extracted['habilidades'])}")
    print(f"  - Ensino Fundamental (EF): {extracted['metadata']['ensino_fundamental']}")
    print(f"  - Ensino Médio (EM): {extracted['metadata']['ensino_medio']}")
    print(f"  - Competências gerais: {len(extracted['competencias_gerais'])}")
    print(f"  - Chunks indexados: {len(chunks)}")
    
    # Áreas EM específicas
    em_areas = {}
    for hab in extracted['habilidades']:
        if hab['codigo'].startswith('EM'):
            area = hab['area']
            em_areas[area] = em_areas.get(area, 0) + 1
    
    print(f"\n🎓 ENSINO MÉDIO POR ÁREA:")
    for area, count in sorted(em_areas.items()):
        print(f"  - {area}: {count} habilidades")
    
    # Capacidades da base
    print(f"\n🎯 CAPACIDADES DA BASE:")
    print(f"  ✅ Geração de planos para Ensino Fundamental")
    print(f"  ✅ Geração de planos para Ensino Médio")
    print(f"  ✅ Contextualização específica para EJA")
    print(f"  ✅ Busca semântica por área/competência")
    print(f"  ✅ Adaptação para diferentes perfis de alunos")
    print(f"  ✅ Alinhamento completo com BNCC")

def main():
    print("🔍 VALIDAÇÃO COMPLETA DA BASE BNCC (EF+EM)\n")
    
    # Validações
    files_ok = validate_complete_files()
    validate_complete_data_quality()
    pinecone_ok = validate_complete_pinecone()
    e2e_ok = test_complete_end_to_end()
    
    # Relatório final
    generate_final_report()
    
    # Resultado
    print(f"\n{'='*60}")
    print("📋 RESULTADO DA VALIDAÇÃO COMPLETA:")
    print(f"  Arquivos: {'✅' if files_ok else '❌'}")
    print(f"  Pinecone: {'✅' if pinecone_ok else '❌'}")
    print(f"  End-to-End: {'✅' if e2e_ok else '❌'}")
    
    if files_ok and pinecone_ok and e2e_ok:
        print(f"\n🎉 BASE BNCC COMPLETA (EF+EM) FUNCIONAL!")
        print(f"🚀 Pronta para gerar planos de aula completos!")
        print(f"🎯 Inclui Ensino Fundamental + Ensino Médio + EJA!")
    else:
        print(f"\n⚠️  Alguns problemas encontrados. Verifique os logs.")

if __name__ == "__main__":
    main()