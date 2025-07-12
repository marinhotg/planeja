#!/bin/bash

# Script de deploy - PlanEJA API
# Uso: ./deploy.sh

echo "🚀 Deploy PlanEJA..."

# Build
echo "🔨 Build..."
./mvnw clean package -DskipTests

# Deploy
echo "☁️ Deploy..."
gcloud run deploy planeja-api \
  --source . \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --add-cloudsql-instances=planeja-backend:southamerica-east1:planeja-db \
  --set-secrets="PINECONE_API_KEY=pinecone-api-key:latest,GEMINI_API_KEY=gemini-api-key:latest,PINECONE_HOST=pinecone-host:latest,DB_PASSWORD=db-password:latest" \
  --set-env-vars="SPRING_PROFILES_ACTIVE=production,GEMINI_MODEL=gemini-2.5-flash"

echo "✅ Pronto! URL: https://planeja-api-1093820414427.southamerica-east1.run.app"