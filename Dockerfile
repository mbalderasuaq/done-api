# Etapa 1: Construcción
FROM oven/bun:latest AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package.json tsconfig.json ./

# Instala las dependencias
RUN bun install

# Copia el resto del código de la aplicación
COPY . .

# Compila el proyecto TypeScript
RUN bun run tsc

# Etapa 2: Ejecución
FROM oven/bun:latest AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos construidos desde la etapa anterior
COPY --from=builder /app /app

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["bun", "start"]
