# Done API

API de gestión de tareas desarrollada con Node.js, TypeScript, Express y Bun. Esta API incluye funcionalidades para gestionar tareas, con una arquitectura basada en controladores, servicios, repositorios y conectividad a bases de datos como MongoDB y Redis. 

## Tabla de Contenidos

En este proyecto encontrarás dos formas de ejecutar la aplicación:

- [Configuración](#configuración)
- [Docker](#docker)
- [Ejecutar Localmente](#ejecutar-localmente)
- [API Endpoints](#api-endpoints)
- [Entidades](#entidades)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Configuración

### Clonar el Repositorio

```bash
git clone https://github.com/mbalderasuaq/done-api.git
cd done-api
```

### Variables de Entorno

El proyecto usa un archivo `.env` para configurar los servicios. Asegúrate de tener configuradas las siguientes variables de entorno:

- `DB_URL`: URL de conexión a MongoDB.
- `DB_NAME`: Nombre de la base de datos de MongoDB.
- `REDIS_URL`: URL de conexión a Redis.

Ejemplo de `.env`:

```bash
DB_URL=mongodb://mongo:27017
DB_NAME=done
REDIS_URL=redis://redis:6379
```

>[!IMPORTANT]
> Asegúrate de tener un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias.

## Docker

### Requisitos

- [**Docker**](https://www.docker.com/) para levantar los servicios en contenedores.

### Ejecutar Docker

Si prefieres ejecutar el proyecto en contenedores Docker, puedes usar los siguientes comandos:

1. **Levantar la aplicación con Docker Compose:**

   ```bash
   docker compose up --build
   ```

2. **Detener los contenedores:**

   ```bash
   docker compose down
   ```

## Ejecutar Localmente

### Requisitos

- Cualquiera de estos entornos de ejecución 
    - [**Bun**](https://bun.sh/) (recomendado)
    - [**Node.js**](https://nodejs.org/)
    - [**Yarn**](https://yarnpkg.com/)
- [**MongoDB**](https://www.mongodb.com/) como base de datos NoSQL.
- [**Redis**](https://redis.io/) para almacenamiento en caché.

### Instalar Dependencias

Para instalar las dependencias del proyecto, puedes usar uno de los siguientes comandos:

```bash
bun install
```
```bash
npm install
```
```bash
yarn install
```

### Levantar el Servidor

Para levantar el servidor, puedes usar uno de los siguientes comandos:

```bash
bun start
```
```bash
npm start
```
```bash
yarn start
```

Esto levantará el servidor en `http://localhost:3000`.

## API Endpoints

### Tareas

- **GET `/tasks`**: Obtiene todas las tareas con paginación.
    - **Query Params:**
        - `title`: Busca tareas por título.
        - `status`: Busca tareas por estado.
        - `limit`: Número de tareas por página.
        - `offset`: Número de página.
- **GET `/tasks/:id`**: Obtiene una tarea por ID.
- **POST `/tasks`**: Crea una nueva tarea.
- **PUT `/tasks/:id`**: Actualiza una tarea por ID.
- **PATCH `/tasks/:id`**: Actualiza un campo específico de una tarea.
- **DELETE `/tasks/:id`**: Elimina una tarea por ID.

## Entidades

### Tarea

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "string",
  "dueDate": "string",
  "createdAt": "string",
}
```

## Tecnologías Utilizadas

- **Bun** como entorno de ejecución.
- **Express** para la creación del servidor.
- **TypeScript** para tipado estático.
- **MongoDB** como base de datos NoSQL.
- **Redis** para almacenamiento en caché.
- **Docker** para contenerización de la aplicación.

## Estructura del Proyecto

```json
done-api/
├── controllers/
│   └── task.controller.ts
├── exceptions/
│   └── task.exception.ts
├── infrastructure/
│   ├── mongo/
│   │   └── task.entity.ts
├── interfaces/
│   └── task.interface.ts
├── mappers/
│   └── task.mapper.ts
├── models/
│   └── task.model.ts
├── repositories/
│   └── task.repository.ts
├── routes/
│   └── task.routes.ts 
├── services/
│   └── task.service.ts                        
├── .env   
├── .gitignore 
├── docker-compose.yml                       
├── Dockerfile   
├── index.ts                           
├── package.json 
├── readme.md                 
├── swagger.json                  
└─── tsconfig.json                                  
```