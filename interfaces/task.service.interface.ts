import type { TaskModel } from "../models/task.model";

export interface TaskServiceInterface {
    getTaskById(id: string): Promise<TaskModel | null>;
    getAllTasks(limit: number, offset: number): Promise<TaskModel[]>;
    getTasksByTitle(title: string, limit: number, offset: number): Promise<TaskModel[] | null>;
    getTasksByStatus(status: boolean, limit: number, offset: number): Promise<TaskModel[] | null>;
    getTasksCount(): Promise<number>;
    createTask(title: string, description: string, status: boolean, dueDate: Date | null): Promise<TaskModel>;
    updateTaskById(id: string, title: string | null, description: string | null, status: boolean | null, dueDate: Date | null): Promise<void>;
    deleteTaskById(id: string): Promise<void>;
}