#!/usr/bin/env python3
"""
Script: Criação de chunks para base completa EF+EM
Execute: python scripts/03_create_chunks_complete.py
"""

import json
import os
import unicodedata
import re
from typing import List, Dict

def remove_accents(text):
    """Remove acentos para IDs ASCII"""
    text = unicodedata.normalize('NFD', text)
    text = ''.join(char for char in text if unicodedata.category(char) != 'Mn')
    text = text.lower().replace(' ', '_')
    text = re.sub(r'[^a-z0-9_]', '_', text)
    text = re.sub(r'_+', '_', text)
    return text.strip('_')

class BNCCCompleteChunker:
    def __init__(self, chunk_size: int = 800, overlap: int = 100):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def create_semantic_chunks(self, bncc_data: Dict) -> List[Dict]:
        """Cria chunks para base completa EF+EM"""
        
        print("✂️ Criando chunks semânticos EF+EM...")
        
        chunks = []
        
        # 1. Chunks de Competências Gerais
        print("  🎯 Processando competências gerais...")
        for comp in bncc_data["competencias_gerais"]:
            chunks.append({
                "id": f"comp_geral_{comp.get('numero', 0):02d}",
                "type": "competencia_geral",
                "content": f"Competência Geral {comp.get('numero', 0)}: {comp.get('descricao', '')}",
                "metadata": {
                    "competencia_numero": comp.get('numero', 0),
                    "area": "geral",
                    "etapa": "todas",
                    "adaptavel_eja": True,
                    "fonte": "bncc_competencias_gerais"
                }
            })
        
        print(f"    ✅ Competências gerais: {len([c for c in chunks if c['type'] == 'competencia_geral'])}")
        
        # 2. Separar habilidades por etapa
        hab_ef = [h for h in bncc_data["habilidades"] if h["codigo"].startswith("EF")]
        hab_em = [h for h in bncc_data["habilidades"] if h["codigo"].startswith("EM")]
        
        print(f"  📚 Habilidades EF: {len(hab_ef)}")
        print(f"  🎓 Habilidades EM: {len(hab_em)}")
        
        # 3. Processar habilidades EF (mesmo que antes)
        print("  📚 Processando habilidades EF...")
        chunks_ef = self._create_ef_chunks(hab_ef)
        chunks.extend(chunks_ef)
        
        # 4. Processar habilidades EM (novo!)
        print("  🎓 Processando habilidades EM...")
        chunks_em = self._create_em_chunks(hab_em)
        chunks.extend(chunks_em)
        
        # 5. Chunks específicos EJA
        print("  👥 Criando chunks específicos para EJA...")
        eja_chunks = self._create_eja_specific_chunks()
        chunks.extend(eja_chunks)
        
        print(f"  ✅ Total de chunks criados: {len(chunks)}")
        return chunks
    
    def _create_ef_chunks(self, habilidades_ef: List[Dict]) -> List[Dict]:
        """Cria chunks para Ensino Fundamental"""
        
        chunks = []
        
        # Agrupar por área e ano
        grouped = {}
        for hab in habilidades_ef:
            area = hab["area"]
            ano = hab["ano"]
            
            if area not in grouped:
                grouped[area] = {}
            if ano not in grouped[area]:
                grouped[area][ano] = []
            
            grouped[area][ano].append(hab)
        
        # Criar chunks
        for area, anos in grouped.items():
            for ano, habilidades in anos.items():
                for i in range(0, len(habilidades), 2):
                    chunk_habs = habilidades[i:i+2]
                    
                    content = f"Área: {area} - {ano}\n\n"
                    for hab in chunk_habs:
                        content += f"Habilidade {hab['codigo']}: {hab['descricao']}\n\n"
                    
                    content += f"[CONTEXTO EJA]: Estas habilidades de {area} podem ser adaptadas para jovens e adultos considerando suas experiências de vida e tempo de estudo disponível."
                    
                    chunk_id = f"hab_{remove_accents(area)}_{ano.replace('º', '').replace(' ', '_')}_{i//2:02d}"
                    
                    chunks.append({
                        "id": chunk_id,
                        "type": "habilidades_ef",
                        "content": content,
                        "metadata": {
                            "area": area,
                            "ano": ano,
                            "etapa": "ensino_fundamental",
                            "codigos_habilidades": [hab['codigo'] for hab in chunk_habs],
                            "quantidade_habilidades": len(chunk_habs),
                            "adaptavel_eja": True,
                            "fonte": "bncc_ef"
                        }
                    })
        
        return chunks
    
    def _create_em_chunks(self, habilidades_em: List[Dict]) -> List[Dict]:
        """Cria chunks para Ensino Médio (NOVO!)"""
        
        chunks = []
        
        # Agrupar por área
        grouped = {}
        for hab in habilidades_em:
            area = hab["area"]
            
            if area not in grouped:
                grouped[area] = []
            
            grouped[area].append(hab)
        
        print(f"    📊 Áreas EM encontradas: {list(grouped.keys())}")
        
        # Criar chunks por área
        for area, habilidades in grouped.items():
            # Chunks de 2-3 habilidades cada
            for i in range(0, len(habilidades), 2):
                chunk_habs = habilidades[i:i+2]
                
                content = f"Área: {area} - Ensino Médio\n\n"
                for hab in chunk_habs:
                    content += f"Habilidade {hab['codigo']}: {hab['descricao']}\n\n"
                
                content += f"[CONTEXTO EJA]: Estas habilidades do Ensino Médio podem ser adaptadas para jovens e adultos, conectando com o mundo do trabalho e projeto de vida."
                
                chunk_id = f"hab_em_{remove_accents(area)}_{i//2:02d}"
                
                chunks.append({
                    "id": chunk_id,
                    "type": "habilidades_em",
                    "content": content,
                    "metadata": {
                        "area": area,
                        "ano": "Ensino Médio",
                        "etapa": "ensino_medio",
                        "codigos_habilidades": [hab['codigo'] for hab in chunk_habs],
                        "quantidade_habilidades": len(chunk_habs),
                        "adaptavel_eja": True,
                        "fonte": "bncc_em"
                    }
                })
        
        print(f"    ✅ Chunks EM criados: {len(chunks)}")
        return chunks
    
    def _create_eja_specific_chunks(self) -> List[Dict]:
        """Chunks específicos para EJA"""
        
        eja_chunks = [
            {
                "id": "eja_orientacoes_gerais",
                "type": "orientacoes_eja",
                "content": """Orientações Pedagógicas para EJA:

A Educação de Jovens e Adultos (EJA) atende estudantes que não tiveram acesso ou continuidade de estudos na idade própria. É fundamental considerar:

1. Diversidade de perfis: trabalhadores, donas de casa, idosos
2. Experiências de vida como ponto de partida
3. Necessidade de contextualização dos conteúdos
4. Flexibilidade nos tempos e espaços de aprendizagem
5. Metodologias que valorizem o diálogo e a participação

As competências e habilidades da BNCC devem ser adaptadas considerando as especificidades deste público.""",
                "metadata": {
                    "area": "pedagogia",
                    "tipo": "orientacoes_metodologicas",
                    "adaptavel_eja": True,
                    "fonte": "diretrizes_eja"
                }
            },
            {
                "id": "eja_contextualizacao",
                "type": "contextualizacao_eja", 
                "content": """Contextualização de Conteúdos na EJA:

Para tornar os conteúdos significativos para jovens e adultos:

1. Relacionar com experiências profissionais
2. Conectar com questões do cotidiano familiar
3. Abordar temas de cidadania e direitos
4. Valorizar saberes populares e culturais
5. Propor projetos interdisciplinares
6. Usar recursos visuais e práticos

Exemplo: Matemática financeira a partir do orçamento familiar, ou Língua Portuguesa através da leitura de manuais de trabalho.""",
                "metadata": {
                    "area": "metodologia",
                    "tipo": "estrategias_contextualizacao", 
                    "adaptavel_eja": True,
                    "fonte": "proposta_curricular_eja"
                }
            },
            {
                "id": "eja_ensino_medio_trabalho",
                "type": "orientacoes_em_eja",
                "content": """Ensino Médio na EJA - Mundo do Trabalho:

O Ensino Médio na EJA deve considerar:

1. Preparação para o mundo do trabalho
2. Projeto de vida dos estudantes
3. Competências para o século XXI
4. Protagonismo juvenil e cidadania
5. Articulação com educação profissional

As habilidades do EM devem ser contextualizadas para a realidade dos estudantes adultos, conectando aprendizagem formal com experiências práticas do cotidiano e trabalho.""",
                "metadata": {
                    "area": "ensino_medio_eja",
                    "tipo": "orientacoes_metodologicas",
                    "adaptavel_eja": True,
                    "fonte": "diretrizes_em_eja"
                }
            }
        ]
        
        return eja_chunks

def main():
    print("🚀 CRIAÇÃO DE CHUNKS COMPLETOS EF+EM\n")
    
    # Carregar dados completos
    input_file = "data/processed/bncc_extracted_complete.json"
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        print("   Execute primeiro: python scripts/02_extract_complete.py")
        return
    
    with open(input_file, "r", encoding="utf-8") as f:
        bncc_data = json.load(f)
    
    print(f"📊 Dados carregados:")
    print(f"  - Competências gerais: {len(bncc_data['competencias_gerais'])}")
    print(f"  - Total habilidades: {len(bncc_data['habilidades'])}")
    print(f"  - EF: {bncc_data['metadata']['ensino_fundamental']}")
    print(f"  - EM: {bncc_data['metadata']['ensino_medio']}")
    
    # Criar chunks
    chunker = BNCCCompleteChunker()
    chunks = chunker.create_semantic_chunks(bncc_data)
    
    # Estatísticas
    types_count = {}
    for chunk in chunks:
        chunk_type = chunk["type"]
        types_count[chunk_type] = types_count.get(chunk_type, 0) + 1
    
    print(f"\n📊 Estatísticas dos chunks:")
    for chunk_type, count in types_count.items():
        print(f"  - {chunk_type}: {count}")
    
    # Salvar chunks
    output_file = "data/processed/bncc_chunks_complete.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
    
    size_mb = os.path.getsize(output_file) / (1024 * 1024)
    print(f"\n✅ Chunks completos criados!")
    print(f"💾 Salvos em: {output_file} ({size_mb:.1f} MB)")
    print(f"📊 Total: {len(chunks)} chunks")

if __name__ == "__main__":
    main()