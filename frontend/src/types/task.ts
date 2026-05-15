// src/types/task.ts
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  deadline: Date | null;
  assignee?: string;
}

export interface Column {
  id: Status;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
}