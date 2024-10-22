import type { TaskModel } from "../models/task.model";

export interface TaskRepositoryInterface {
    getByIdAsync(id: string): Promise<TaskModel | null>;
    getByTitleAsync(title: string, limit: number, offset: number): Promise<TaskModel[] | null>;
    getByTitleExactAsync(title: string): Promise<TaskModel | null>;
    getByStatusAsync(status: boolean, limit: number, offset: number): Promise<TaskModel[]>;
    getAllAsync(limit: number, offset: number): Promise<TaskModel[]>;
    getTasksCountAsync(): Promise<number>;
    createAsync(title: string, description: string, status: boolean, dueDate: Date | null): Promise<TaskModel>;
    updateByIdAsync(id: string, title: string | null, description: string | null, status: boolean | null, dueDate: Date | null): Promise<void>;
    deleteByIdAsync(id: string): Promise<void>;
}