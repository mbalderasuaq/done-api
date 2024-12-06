export interface TaskEntity {
    _id: string;
    title: string;
    description: string;
    status: boolean;
    dueDate: Date | null;
    createdAt: Date;
}