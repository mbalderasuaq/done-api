export class TaskNotFoundException extends Error {
    constructor(id: string) {
        super(`Task with id ${id} not found`);
    }
}

export class TaskAlreadyExistsException extends Error {
    constructor(title: string) {
        super(`Task with title ${title} already exists`);
    }
}

export class TaskInvalidRequestException extends Error {
    constructor() {
        super('Invalid request');
    }
}