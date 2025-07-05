import requests
import os
from pathlib import Path

def download_bncc_documents():
    """Baixa todos os documentos oficiais da BNCC"""
    
    documents = {
        "bncc_ei_ef.pdf": "https://www.gov.br/mec/pt-br/escola-em-tempo-integral/BNCC_EI_EF_110518_versaofinal.pdf",
    }
    
    # Criar diretório
    os.makedirs("data/bncc_raw", exist_ok=True)
    
    for filename, url in documents.items():
        print(f"Baixando {filename}...")
        response = requests.get(url)
        
        if response.status_code == 200:
            with open(f"data/bncc_raw/{filename}", "wb") as f:
                f.write(response.content)
            print(f"✅ {filename} baixado com sucesso")
        else:
            print(f"❌ Erro ao baixar {filename}: {response.status_code}")

if __name__ == "__main__":
    download_bncc_documents()