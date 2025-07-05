# BNCC Processor

Pipeline para processar a BNCC oficial e criar base vetorial no Pinecone.

## O que faz

Transforma o PDF da BNCC em 727 chunks semânticos indexados no Pinecone para busca por habilidades e competências.

**Resultado:** 1.403 habilidades (1.220 EF + 183 EM) prontas para gerar planos de aula.

## Setup

```bash
# 1. Instalar dependências
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# 2. Configurar Pinecone
cp .env.example .env
# Edite .env e adicione sua PINECONE_API_KEY
```

## Executar

```bash
python scripts/01_download_bncc.py
python scripts/02_extract_complete.py
python scripts/03_create_chunks_complete.py
python scripts/04_generate_embeddings_complete.py
python scripts/05_reindex_complete.py
python scripts/06_validate_complete.py
```

**Tempo total:** ~8 minutos

## Resultado

Base vetorial no Pinecone pronta para o backend Java buscar habilidades da BNCC.
