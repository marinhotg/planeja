# PlanEJA 📚

> **Plataforma inteligente de geração automática de planos de aula para a Educação de Jovens e Adultos (EJA)**

O PlanEJA é uma solução inovadora que alia tecnologia e pedagogia para apoiar educadores na criação de planos de aula personalizados, contextualizados e alinhados à Base Nacional Comum Curricular (BNCC).

## 🎯 Sobre a Solução

O PlanEJA é uma plataforma inteligente de geração automática de planos de aula para a Educação de Jovens e Adultos (EJA), feita para apoiar quem ensina e transformar a experiência de quem aprende.

### Principais Diferenciais

- **Personalização Inteligente**: Planos adaptados ao perfil específico da turma
- **Aderência Curricular**: Alinhamento automático com a BNCC
- **Abordagem Andragógica**: Metodologia específica para EJA
- **Interface Intuitiva**: Experiência fluida e responsiva
- **Geração Automática**: Eliminação de processos manuais complexos

## 🏗️ Arquitetura da Solução

A arquitetura do PlanEJA foi pensada para aliar simplicidade de uso, eficiência técnica e contextualização pedagógica. A solução é composta por quatro elementos principais que operam de forma integrada:

### 1. Interface Frontend (Next.js)
- **Framework**: Next.js com React
- **Características**: Interface fluida, responsiva e acessível
- **Design**: Prioriza usabilidade para docentes
- **Compatibilidade**: Funciona em dispositivos móveis
- **Funcionalidades**:
  - Formulários intuitivos para definição de perfil da turma
  - Sistema de loading interativo e dinâmico
  - Geração de PDF com marca da aplicação
  - Autenticação via Google OAuth

### 2. Backend Java (Spring Boot)
- **Framework**: Spring Boot
- **Responsabilidades**: Gerenciamento de fluxos de dados e orquestração de processos
- **Características**: Escalabilidade, segurança e robustez
- **Funcionalidades**:
  - APIs RESTful para comunicação com frontend
  - Integração com Google Gemini AI
  - Sistema de autenticação JWT
  - Gerenciamento de perfis de turma
  - Processamento de requisições de geração de planos

### 3. Sistema RAG com Base Vetorizada da BNCC
- **Tecnologia**: Retrieval-Augmented Generation (RAG)
- **Base de Dados**: BNCC completa vetorizada
- **Diferencial**: Consulta semântica de trechos relevantes
- **Benefícios**:
  - Resolve desafio de IAs com grandes volumes de texto
  - Assegura aderência curricular real
  - Evita alucinações da IA
  - Contextualização precisa por disciplina

### 4. Módulo de Geração com IA Gemini (Google)
- **IA**: Google Gemini
- **Entrada**: Contexto personalizado processado pelo RAG
- **Saída**: Planos de aula únicos e adaptados
- **Características**:
  - Abordagem andragógica específica para EJA
  - Alinhamento automático com BNCC
  - Personalização ao perfil da turma
  - Geração de conteúdo estruturado

## 🚀 Funcionalidades Principais

### Para Educadores
- **Definição de Perfil da Turma**: Caracterização detalhada dos estudantes
- **Seleção de Níveis Educacionais**: Ensino Fundamental (Etapas 1 e 2) e Ensino Médio
- **Tema Livre**: Definição personalizada do tema da aula
- **Geração Inteligente**: Planos contextualizados e alinhados à BNCC
- **Download em PDF**: Exportação com marca da aplicação
- **Gestão de Perfis**: Criação e edição de perfis de turma

### Características Técnicas
- **Loading Dinâmico**: Experiência visual satisfatória durante geração
- **Interface Responsiva**: Funciona em desktop e mobile
- **Autenticação Segura**: Login via Google OAuth
- **Armazenamento Persistente**: Perfis e planos salvos
- **Exportação Profissional**: PDFs com formatação adequada

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.3.3**: Framework React para aplicações web
- **React 19.0.0**: Biblioteca para interfaces de usuário
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **NextAuth.js**: Autenticação
- **jsPDF + html2canvas**: Geração de PDFs

### Backend
- **Spring Boot**: Framework Java para aplicações web
- **Java**: Linguagem de programação
- **JWT**: Autenticação baseada em tokens
- **Maven**: Gerenciamento de dependências

### IA e Processamento
- **Google Gemini AI**: Geração de conteúdo
- **Sistema RAG**: Retrieval-Augmented Generation
- **Pinecone**: Base vetorizada da BNCC
- **Embeddings**: Processamento semântico

### Infraestrutura
- **Docker**: Containerização
- **PostgreSQL**: Banco de dados
- **Nginx**: Servidor web (produção)

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- Java 17+
- Docker e Docker Compose
- Conta Google Cloud (para Gemini AI)
- Conta Pinecone (para base vetorizada)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Banco de Dados
```bash
docker-compose -f docker-compose.db.yml up -d
```

### Processamento da BNCC
```bash
cd bncc-processor
pip install -r requirements.txt
python scripts/01_download_bncc.py
python scripts/02_extract_complete.py
python scripts/03_create_chunks_complete.py
python scripts/04_generate_embeddings_complete.py
python scripts/05_reindex_complete.py
python scripts/06_validate_complete.py
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente (Frontend)
```env
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Variáveis de Ambiente (Backend)
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/planeja
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
GOOGLE_AI_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
JWT_SECRET=your-jwt-secret
```

## 📁 Estrutura do Projeto

```
planeja/
├── frontend/                 # Interface Next.js
│   ├── src/app/             # Páginas e componentes
│   ├── public/              # Arquivos estáticos
│   └── package.json
├── backend/                  # API Spring Boot
│   ├── src/main/java/       # Código Java
│   ├── src/main/resources/  # Configurações
│   └── pom.xml
├── bncc-processor/          # Processamento da BNCC
│   ├── scripts/             # Scripts Python
│   ├── data/                # Dados processados
│   └── requirements.txt
└── docker-compose.db.yml    # Configuração do banco
```

---

**PlanEJA** - Transformando a educação através da tecnologia 🤖📚
