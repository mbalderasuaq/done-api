import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";
import { TaskRepository } from "../repositories/task.repository";
import { MongoClient } from "mongodb";
import { createClient, type RedisClientType } from "redis";

const TaskRouter = Router();

const dbURL = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const redisURL = process.env.REDIS_URL;

if (!dbURL) {
    throw new Error("DB_URL is not provided");
}

if (!dbName) {
    throw new Error("DB_NAME is not provided");
}

if (!redisURL) {
    throw new Error("REDIS_URL is not provided");
}

console.log('DB_URL', dbURL);
console.log('DB_NAME', dbName);
console.log('REDIS_URL', redisURL);

const mongoClient = new MongoClient(dbURL);
const redisClient: RedisClientType = createClient({ url: redisURL });
redisClient.on('error', err => console.log('Redis Client Error', err));

try{
redisClient.connect();
} catch (err) {
    console.log('Redis Client Error', err);
}

const taskRepository = new TaskRepository(mongoClient, dbName);
const taskService = new TaskService(taskRepository, redisClient);
const taskController = new TaskController(taskService);

TaskRouter.get("/:id", (req, res) => taskController.getTaskById(req, res));
TaskRouter.get("/", (req, res) => taskController.getAllTasks(req, res));
TaskRouter.post("/", (req, res) => taskController.createTask(req, res));
TaskRouter.put("/:id", (req, res) => taskController.updateTaskById(req, res));
TaskRouter.patch("/:id", (req, res) => taskController.updateTaskFieldById(req, res));
TaskRouter.delete("/:id", (req, res) => taskController.deleteTaskById(req, res));

export { TaskRouter };
