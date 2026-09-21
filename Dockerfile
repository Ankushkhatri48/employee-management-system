# ========================================================
# STAGE 1: Build the React Frontend
# ========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY employee-frontend/package*.json ./
RUN npm install
COPY employee-frontend/ ./
RUN npm run build

# ========================================================
# STAGE 2: Build the Spring Boot Backend with React bundle
# ========================================================
FROM maven:3.9.6-eclipse-temurin-17 AS backend-builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Copy compiled React frontend assets into Spring Boot's static resources
COPY --from=frontend-builder /frontend/dist/ ./src/main/resources/static/
RUN mvn clean package -DskipTests

# ========================================================
# STAGE 3: Production Runtime (Alpine JRE)
# ========================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
