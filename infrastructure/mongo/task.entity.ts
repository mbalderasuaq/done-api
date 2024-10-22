export interface TaskEntity {
    id: string;
    title: string;
    description: string;
    status: boolean;
    dueDate: Date | null;
    createdAt: Date;
}