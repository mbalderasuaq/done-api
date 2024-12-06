import type { TaskEntity } from "../infrastructure/mongo/task.entity";
import type { TaskModel } from "../models/task.model";

export function TaskEntityToModel(taskEntity: TaskEntity): TaskModel {
    return {
        id: taskEntity._id,
        title: taskEntity.title,
        description: taskEntity.description,
        status: taskEntity.status,
        dueDate: taskEntity.dueDate,
        createdAt: taskEntity.createdAt,
    };
}