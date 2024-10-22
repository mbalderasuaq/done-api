import type { RedisClientType } from "redis";
import { TaskAlreadyExistsException, TaskNotFoundException } from "../exceptions/task.exception";
import type { TaskServiceInterface } from "../interfaces/task.service.interface";
import type { TaskModel } from "../models/task.model";
import type { TaskRepository } from "../repositories/task.repository";

export class TaskService implements TaskServiceInterface {
    private readonly taskRepository: TaskRepository;
    private readonly redisClient: RedisClientType;

    constructor(taskRepository: TaskRepository, redisClient: RedisClientType) {
        this.taskRepository = taskRepository;
        this.redisClient = redisClient;
    }

    async getTaskById(id: string): Promise<TaskModel | null> {
        const cachedTask = await this.redisClient.get(`task:${id}`);

        if (cachedTask){
            return JSON.parse(cachedTask);
        }

        const task = await this.taskRepository.getByIdAsync(id);

        if (task){
            await this.redisClient.set(`task:${id}`, JSON.stringify(task));
        }

        return task;
    }

    async getAllTasks(limit: number, offset: number): Promise<TaskModel[]> {
        const cacheKey = `tasks:${limit}:${offset}`;
        const cachedTasks = await this.redisClient.get(cacheKey);

        if(cachedTasks){
            return JSON.parse(cachedTasks);
        }

        const tasks = await this.taskRepository.getAllAsync(limit, offset);

        this.redisClient.set(cacheKey, JSON.stringify(tasks));

        return tasks;
    }

    async getTasksByTitle(title: string, limit: number, offset: number): Promise<TaskModel[] | null> {
        const cacheKey = `tasksByTitle:${title}:${limit}:${offset}`;
        const cachedTasks = await this.redisClient.get(cacheKey);

        if(cachedTasks){
            return JSON.parse(cachedTasks);
        }

        const tasks = await this.taskRepository.getByTitleAsync(title, limit, offset);

        this.redisClient.set(cacheKey, JSON.stringify(tasks));

        return tasks; 
    }

    async getTasksByStatus(status: boolean, limit: number, offset: number): Promise<TaskModel[] | null> {
        const cacheKey = `tasksByStatus:${status}:${limit}:${offset}`;
        const cachedTasks = await this.redisClient.get(cacheKey);

        if(cachedTasks){
            return JSON.parse(cachedTasks);
        }

        const tasks = await this.taskRepository.getByStatusAsync(status, limit, offset);

        this.redisClient.set(cacheKey, JSON.stringify(tasks));

        return tasks;
    }

    async getTasksCount(): Promise<number> {
        return await this.taskRepository.getTasksCountAsync();
    }

    async createTask(title: string, description: string, status: boolean, dueDate: Date | null): Promise<TaskModel> {
        const task = await this.taskRepository.getByTitleExactAsync(title);

        if (task) {
            throw new TaskAlreadyExistsException(title);
        }

        const newTask = await this.taskRepository.createAsync(title, description, status, dueDate);

        this.redisClient.set(`task:${newTask.id}`, JSON.stringify(newTask));
        await this.redisClient.del(`tasks`);
        await this.redisClient.del(`tasksByTitle`);
        await this.redisClient.del(`tasksByStatus`);

        return newTask;
    }

    async updateTaskById(id: string, title: string | null, description: string | null, status: boolean | null, dueDate: Date | null): Promise<void> {
        const task = await this.taskRepository.getByIdAsync(id);

        if (!task) {
            throw new TaskNotFoundException(id);
        }

        if (title !== null) {
            const taskWithSameTitle = await this.taskRepository.getByTitleExactAsync(title);

            if (taskWithSameTitle && taskWithSameTitle.id !== id) {
                throw new TaskAlreadyExistsException(title);
            }
        }

        this.redisClient.del(`task:${id}`);
        await this.redisClient.del(`tasks`);
        await this.redisClient.del(`tasksByTitle`);
        await this.redisClient.del(`tasksByStatus`);

        await this.taskRepository.updateByIdAsync(id, title, description, status, dueDate);
    }

    async deleteTaskById(id: string): Promise<void> {
        const task = await this.taskRepository.getByIdAsync(id);

        if (!task) {
            throw new TaskNotFoundException(id);
        }

        this.redisClient.del(`task:${id}`);
        await this.redisClient.del(`tasks`);
        await this.redisClient.del(`tasksByTitle`);
        await this.redisClient.del(`tasksByStatus`);

        await this.taskRepository.deleteByIdAsync(id);
    }
}