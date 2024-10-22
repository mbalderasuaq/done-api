import type { Request, Response } from "express";
import type { TaskServiceInterface } from "../interfaces/task.service.interface";
import type { TaskModel } from "../models/task.model";
import { TaskAlreadyExistsException, TaskNotFoundException } from "../exceptions/task.exception";

export class TaskController {
    private readonly taskService: TaskServiceInterface;

    constructor(taskService: TaskServiceInterface) {
        this.taskService = taskService;
    }

    async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const task = await this.taskService.getTaskById(id);

            if (!task) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }

            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllTasks(req: Request, res: Response): Promise<void> {
        const { limit, offset, title, status } = req.query;
        try {
            const limitValue = parseInt(limit as string) || 10;
            const offsetValue = parseInt(offset as string) - 1 || 0;
            const titleValue = title as string;
            const count = await this.taskService.getTasksCount();
            const pages = Math.ceil(count / limitValue);
            let tasks: TaskModel[] | null = null;

            if (offsetValue < 0 || offsetValue > pages - 1) {
                res.status(400).json({ message: 'Invalid offset value' });
                return;
            }

            if (title) {
                titleValue.trim();
                tasks = await this.taskService.getTasksByTitle(titleValue, limitValue, offsetValue);
            }

            if (status) {
                if(status === 'true' || status === 'false') {
                    const statusValue = status === 'true';
                    tasks = await this.taskService.getTasksByStatus(statusValue, limitValue, offsetValue);
                } else {
                    res.status(400).json({ message: 'Status must be a boolean' });
                    return;
                }
            }

            if (!title && !status){
                tasks = await this.taskService.getAllTasks(limitValue, offsetValue);
            }

            if (tasks?.length === 0) {
                res.status(200).json([]);
                return;
            }
            
            const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?').shift()}`;
            const nextPage = (offsetValue + 1) * limitValue < count ? `${baseUrl}?limit=${limitValue}&offset=${offsetValue + 2}` : null;
            const prevPage = offsetValue > 0 ? `${baseUrl}?limit=${limitValue}&offset=${offsetValue}` : null;

            res.status(200).json({
                pagination: {
                    count: count,
                    pages: Math.ceil((count) / limitValue),
                    nextPage: nextPage,
                    prevPage: prevPage,
                },
                tasks: tasks
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createTask(req: Request, res: Response): Promise<void> {
        try {
            const { title, description, status, dueDate } = req.body;

            if (!title || !description || status == null) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            if (status !== true && status !== false) {
                res.status(400).json({ message: 'Status must be a boolean' });
                return;
            }

            if (dueDate && isNaN(Date.parse(dueDate))) {
                res.status(400).json({ message: 'Invalid date format' });
                return;
            }

            const statusValue = status === 'true';
            const dueDateValue = dueDate ? new Date(dueDate) : null;

            const newTask = await this.taskService.createTask(title, description, statusValue, dueDateValue);

            res.status(201).json(newTask);
        } catch (error) {
            if (error instanceof TaskAlreadyExistsException) {
                res.status(409).json({ message: "Task Already Exists" });
                return;
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateTaskById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { title, description, status, dueDate } = req.body;

            if (!title || !description || status == null) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            if (status !== true && status !== false) {
                res.status(400).json({ message: 'Status must be a boolean' });
                return;
            }

            if (dueDate && isNaN(Date.parse(dueDate))) {
                res.status(400).json({ message: 'Invalid date format' });
                return;
            }

            const statusValue = status === 'true';
            const dueDateValue = dueDate ? new Date(dueDate) : null;

            await this.taskService.updateTaskById(id, title, description, statusValue, dueDateValue);

            res.status(204).send();
        } catch (error) {
            if (error instanceof TaskAlreadyExistsException) {
                res.status(409).json({ message: "Task Already Exists" });
            }

            if (error instanceof TaskNotFoundException) {
                res.status(404).json({ message: "Task not found" });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateTaskFieldById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { title, description, status, dueDate } = req.body;
            let statusValue: boolean | null = null;
            let dueDateValue: Date | null = null;
            let titleValue: string | null = null;
            let descriptionValue: string | null = null;

            if (status !== undefined) {
                if (status !== true && status !== false){
                    res.status(400).json({ message: 'Status must be a boolean' });
                    return;
                } else {
                    statusValue = status;
                }
            }

            if (dueDate) {
                if (isNaN(Date.parse(dueDate))) {
                    res.status(400).json({ message: 'Invalid date format' });
                    return;
                } else {
                    dueDateValue = dueDate ? new Date(dueDate) : null;
                }
            }

            if (title) titleValue = title;

            if (description) descriptionValue = description;

            await this.taskService.updateTaskById(id, titleValue, descriptionValue, statusValue, dueDateValue);

            res.status(204).send();
        } catch (error) {
            if (error instanceof TaskAlreadyExistsException) {
                res.status(409).json({ message: "Task Already Exists" });
            }

            if (error instanceof TaskNotFoundException) {
                res.status(404).json({ message: "Task not found" });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteTaskById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;

            if (!id) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            await this.taskService.deleteTaskById(id);

            res.status(204).send();
        } catch (error) {
            if (error instanceof TaskNotFoundException) {
                res.status(404).json({ message: "Task not found" });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }
}