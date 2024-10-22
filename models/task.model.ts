export interface TaskModel {
    id: string;
    title: string;
    description: string;
    status: boolean;
    dueDate: Date | null;
    createdAt: Date;
}