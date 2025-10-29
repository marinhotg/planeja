#!/bin/bash
set -e

echo "Starting build process..."

# Clean and build with Maven
echo "Building with Maven..."
mvn clean package -DskipTests

echo "Build completed successfully!"
