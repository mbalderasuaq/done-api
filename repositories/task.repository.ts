import type { Collection, MongoClient } from "mongodb";
import type { TaskRepositoryInterface } from "../interfaces/task.repository.interface";
import type { TaskEntity } from "../infrastructure/mongo/task.entity";
import type { TaskModel } from "../models/task.model";
import { TaskEntityToModel } from "../mappers/task.mapper";

export class TaskRepository implements TaskRepositoryInterface {
    private readonly tasks: Collection<TaskEntity>;

    constructor(mongoClient: MongoClient, dbName: string) {
        const database = mongoClient.db(dbName);
        database.createCollection("tasks");
        this.tasks = database.collection<TaskEntity>("tasks");
    }

    async getByIdAsync(id: string): Promise<TaskModel | null> {
        const task = await this.tasks.findOne({ id: id });

        if (!task) {
            return null;
        }

        return TaskEntityToModel(task);
    }

    async getByTitleAsync(title: string, limit: number, offset: number): Promise<TaskModel[] | null> {
        const tasks = await this.tasks.find({ title: { $regex: new RegExp(title, 'i') } }).skip(offset).limit(limit).toArray();
        return tasks.map(TaskEntityToModel);
    }

    async getByStatusAsync(status: boolean, limit: number, offset: number): Promise<TaskModel[]> {
        const tasks = await this.tasks.find({ status: status }).skip(offset).limit(limit).toArray();
        return tasks.map(TaskEntityToModel);
    }

    async getByTitleExactAsync(title: string): Promise<TaskModel | null> {
        const task = await this.tasks.findOne({ title: { $eq: title } });

        if (!task) {
            return null;
        }

        return TaskEntityToModel(task);
    }

    async getAllAsync(limit: number, offset: number): Promise<TaskModel[]> {
        const tasks = await this.tasks.find().skip(offset).limit(limit).toArray();
        return tasks.map(TaskEntityToModel);
    }

    async getTasksCountAsync(): Promise<number> {
        return await this.tasks.countDocuments();
    }

    async createAsync(title: string, description: string, status: boolean, dueDate: Date | null): Promise<TaskModel> {
        const task: TaskEntity = {
            id: crypto.randomUUID(),
            title: title,
            description: description,
            status: status,
            dueDate: dueDate ? dueDate : null,
            createdAt: new Date(),
        };

        await this.tasks.insertOne(task);
        return TaskEntityToModel(task);
    }

    async updateByIdAsync(id: string, title: string | null, description: string | null, status: boolean | null, dueDate: Date | null): Promise<void> {
        const updateTask: {
            title?: string;
            description?: string;
            status?: boolean;
            dueDate?: Date | null;
        } = {};

        if(title !== null){
            updateTask.title = title
        }

        if(description !== null){
            updateTask.description = description;
        }

        if(status !== null){
            updateTask.status = status;
        }

        updateTask.dueDate = dueDate

        await this.tasks.updateOne({ id: id }, { $set: updateTask });
    }

    async deleteByIdAsync(id: string): Promise<void> {
        await this.tasks.deleteOne({ id: id });
    }
}