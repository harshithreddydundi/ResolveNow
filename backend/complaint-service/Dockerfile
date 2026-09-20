FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/complaint-service-*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
