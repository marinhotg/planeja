#!/usr/bin/env python3
"""
Script CORRIGIDO: Extração completa EF + EM da BNCC
Execute: python scripts/02_extract_complete.py
"""

import pdfplumber
import re
import json
import os
from typing import List, Dict

class BNCCCompleteExtractor:
    def __init__(self):
        self.competencias_gerais = []
        self.habilidades = []
        
    def extract_from_pdf(self, pdf_path: str) -> Dict:
        """Extrai texto estruturado do PDF - EF + EM"""
        
        print(f"🔄 Extraindo texto COMPLETO de {pdf_path}...")
        
        extracted_data = {
            "competencias_gerais": [],
            "habilidades": [],
            "metadata": {
                "source_file": pdf_path,
                "total_pages": 0,
                "pages_processed": 0,
                "ensino_fundamental": 0,
                "ensino_medio": 0
            }
        }
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                total_pages = len(pdf.pages)
                extracted_data["metadata"]["total_pages"] = total_pages
                
                print(f"  📚 Total de páginas: {total_pages}")
                
                full_text = ""
                pages_processed = 0
                
                # Processar todas as páginas
                for page_num, page in enumerate(pdf.pages):
                    try:
                        if page_num % 50 == 0:
                            print(f"  📖 Processando página {page_num + 1}/{total_pages}")
                        
                        text = page.extract_text()
                        if text:
                            full_text += f"\n{text}"
                            pages_processed += 1
                    
                    except Exception as e:
                        continue
                
                extracted_data["metadata"]["pages_processed"] = pages_processed
                print(f"  📄 Texto extraído: {len(full_text):,} caracteres")
                
                # Extrair competências gerais
                print("  🎯 Extraindo competências gerais...")
                extracted_data["competencias_gerais"] = self._extract_competencias_gerais(full_text)
                
                # Extrair habilidades EF + EM
                print("  📚 Extraindo habilidades EF + EM...")
                habilidades = self._extract_habilidades_complete(full_text)
                extracted_data["habilidades"] = habilidades
                
                # Estatísticas por tipo
                ef_count = len([h for h in habilidades if h['codigo'].startswith('EF')])
                em_count = len([h for h in habilidades if h['codigo'].startswith('EM')])
                
                extracted_data["metadata"]["ensino_fundamental"] = ef_count
                extracted_data["metadata"]["ensino_medio"] = em_count
                
                print(f"    ✅ Ensino Fundamental (EF): {ef_count}")
                print(f"    ✅ Ensino Médio (EM): {em_count}")
                
        except Exception as e:
            print(f"❌ Erro ao processar {pdf_path}: {e}")
            return extracted_data
        
        return extracted_data
    
    def _extract_competencias_gerais(self, text: str) -> List[Dict]:
        """Extrai as 10 competências gerais da BNCC"""
        
        competencias = []
        
        # Múltiplos padrões para competências
        patterns = [
            r'Competência\s+(\d+)[:\.]?\s*([^\.]+(?:\.[^Competência]*)*)',
            r'COMPETÊNCIA\s+(\d+)[:\.]?\s*([^\.]+(?:\.[^COMPETÊNCIA]*)*)',
            r'(\d+)\.\s*([^\.]+\.(?:[^\.]+\.)*)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            
            for num, descricao in matches:
                try:
                    descricao_limpa = re.sub(r'\s+', ' ', descricao.strip())
                    descricao_limpa = descricao_limpa[:1000]
                    
                    if len(descricao_limpa) > 100 and int(num) <= 10:
                        competencias.append({
                            "numero": int(num),
                            "descricao": descricao_limpa,
                            "tipo": "competencia_geral"
                        })
                except ValueError:
                    continue
        
        # Remover duplicatas
        competencias_unicas = {}
        for comp in competencias:
            num = comp["numero"]
            if num not in competencias_unicas or len(comp["descricao"]) > len(competencias_unicas[num]["descricao"]):
                competencias_unicas[num] = comp
        
        result = list(competencias_unicas.values())
        result.sort(key=lambda x: x["numero"])
        
        print(f"    ✅ Competências gerais extraídas: {len(result)}")
        return result
    
    def _extract_habilidades_complete(self, text: str) -> List[Dict]:
        """Extrai habilidades EF + EM com padrões corretos"""
        
        habilidades = []
        
        # PADRÃO CORRIGIDO - captura EF E EM
        pattern = r'((?:EF|EM)\d{2}[A-Z]{2,4}\d{2,3})[:\.]?\s*([^\.]+(?:\.[^(?:EF|EM)]*)*)'
        matches = re.findall(pattern, text)
        
        print(f"    🔍 Encontrados {len(matches)} matches de habilidades EF+EM...")
        
        ef_count = 0
        em_count = 0
        
        for codigo, descricao in matches:
            try:
                descricao_limpa = re.sub(r'\s+', ' ', descricao.strip())
                descricao_limpa = descricao_limpa[:800]
                
                if len(descricao_limpa) > 30:
                    # Determinar tipo
                    tipo_ensino = "ensino_fundamental" if codigo.startswith('EF') else "ensino_medio"
                    
                    if codigo.startswith('EF'):
                        ef_count += 1
                    else:
                        em_count += 1
                    
                    habilidades.append({
                        "codigo": codigo,
                        "descricao": descricao_limpa,
                        "area": self._extract_area_from_codigo(codigo),
                        "ano": self._extract_ano_from_codigo(codigo),
                        "tipo": "habilidade_especifica",
                        "etapa": tipo_ensino
                    })
            except Exception as e:
                continue
        
        # Remover duplicatas
        habilidades_unicas = {}
        for hab in habilidades:
            codigo = hab["codigo"]
            if codigo not in habilidades_unicas or len(hab["descricao"]) > len(habilidades_unicas[codigo]["descricao"]):
                habilidades_unicas[codigo] = hab
        
        result = list(habilidades_unicas.values())
        
        print(f"    ✅ Habilidades únicas extraídas: {len(result)}")
        print(f"       - EF (Ensino Fundamental): {len([h for h in result if h['codigo'].startswith('EF')])}")
        print(f"       - EM (Ensino Médio): {len([h for h in result if h['codigo'].startswith('EM')])}")
        
        # Mostrar distribuição por área
        areas = {}
        for hab in result:
            area = hab["area"]
            areas[area] = areas.get(area, 0) + 1
        
        print(f"    📊 Por área: {dict(sorted(areas.items()))}")
        
        return result
    
    def _extract_area_from_codigo(self, codigo: str) -> str:
        """Extrai área do conhecimento - EF + EM"""
        
        # Ensino Fundamental
        if codigo.startswith('EF'):
            area_mapping = {
                "LP": "Língua Portuguesa",
                "MA": "Matemática", 
                "CI": "Ciências",
                "GE": "Geografia",
                "HI": "História",
                "AR": "Arte",
                "EF": "Educação Física",
                "ER": "Ensino Religioso",
                "LI": "Língua Inglesa"
            }
            
            if len(codigo) >= 6:
                area_code = codigo[4:6]
                return area_mapping.get(area_code, "Desconhecida")
        
        # Ensino Médio
        elif codigo.startswith('EM'):
            area_mapping_em = {
                "LGG": "Linguagens e suas Tecnologias",
                "MAT": "Matemática e suas Tecnologias",
                "CNT": "Ciências da Natureza e suas Tecnologias", 
                "CHS": "Ciências Humanas e Sociais Aplicadas"
            }
            
            # EM13LGG101 -> LGG
            area_match = re.search(r'EM\d{2}([A-Z]{2,4})', codigo)
            if area_match:
                area_code = area_match.group(1)
                return area_mapping_em.get(area_code, "Desconhecida")
        
        return "Desconhecida"
    
    def _extract_ano_from_codigo(self, codigo: str) -> str:
        """Extrai ano/série do código - EF + EM"""
        
        if codigo.startswith('EF'):
            # EF01MA01 -> 01º ano
            if len(codigo) >= 4:
                ano_num = codigo[2:4]
                return f"{ano_num}º ano"
        elif codigo.startswith('EM'):
            # EM13LGG101 -> Ensino Médio (todos os anos)
            return "Ensino Médio"
        
        return "Ano desconhecido"

def main():
    print("🚀 EXTRAÇÃO COMPLETA DA BNCC (EF + EM)\n")
    
    extractor = BNCCCompleteExtractor()
    
    # Processar PDF
    pdf_file = "data/bncc_raw/bncc_ei_ef.pdf"
    
    if not os.path.exists(pdf_file):
        print(f"❌ Arquivo não encontrado: {pdf_file}")
        return
    
    print(f"📄 Processando {pdf_file}...")
    data = extractor.extract_from_pdf(pdf_file)
    
    # Salvar dados completos
    output_file = "data/processed/bncc_extracted_complete.json"
    os.makedirs("data/processed", exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Estatísticas finais
    print(f"\n✅ Extração COMPLETA concluída!")
    print(f"📊 Competências gerais: {len(data['competencias_gerais'])}")
    print(f"📊 Total de habilidades: {len(data['habilidades'])}")
    print(f"   - Ensino Fundamental: {data['metadata']['ensino_fundamental']}")
    print(f"   - Ensino Médio: {data['metadata']['ensino_medio']}")
    print(f"📊 Páginas processadas: {data['metadata']['pages_processed']}/{data['metadata']['total_pages']}")
    print(f"💾 Dados salvos em: {output_file}")
    
    # Mostrar exemplos EM
    if data["habilidades"]:
        em_habs = [h for h in data["habilidades"] if h["codigo"].startswith("EM")]
        if em_habs:
            print(f"\n📝 Exemplos de habilidades EM encontradas:")
            for hab in em_habs[:5]:
                print(f"  {hab['codigo']} ({hab['area']}): {hab['descricao'][:100]}...")
        else:
            print(f"\n⚠️  Nenhuma habilidade EM foi extraída - verificar padrões")
    
    # Verificar códigos específicos
    target_codes = ["EM13LGG101", "EM13LGG102", "EM13LGG103", "EM13LGG104", "EM13LGG105"]
    found_targets = [h for h in data["habilidades"] if h["codigo"] in target_codes]
    
    if found_targets:
        print(f"\n🎯 Códigos específicos encontrados: {len(found_targets)}")
        for hab in found_targets:
            print(f"  ✅ {hab['codigo']}: {hab['descricao'][:80]}...")
    else:
        print(f"\n⚠️  Códigos específicos não encontrados - pode precisar ajustar regex")

if __name__ == "__main__":
    main()