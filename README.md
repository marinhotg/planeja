# PlanEJA

Plataforma inteligente para geração automática de planos de aula personalizados para EJA, utilizando inteligência artificial.

## Estrutura

```
planeja/
├── frontend/     # Next.js + TypeScript + Tailwind
└── backend/      # Spring Boot + Java 17
```

## Pré-requisitos

- Node.js 18+
- Java 17+
- Docker e Docker Compose
- npm

## Como rodar

```bash
# Subir PostgreSQL
docker-compose -f docker-compose.db.yml up -d

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

## URLs importantes

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432 (planeja/planeja123)

## Estrutura da API

- `GET /api/test` - Teste de conexão
- `GET /api/health` - Health check
