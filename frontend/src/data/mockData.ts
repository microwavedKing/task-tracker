// src/data/mockData.ts
import { type Task, type Column } from '../types/task';

export const columns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500'
  },
  {
    id: 'done',
    title: 'Done',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Спроектировать архитектуру',
    description: 'Разработать event-driven архитектуру с очередью RabbitMQ',
    status: 'todo',
    priority: 'high',
    tags: ['architecture', 'design'],
    createdAt: new Date('2024-01-15'),
    deadline: new Date('2024-01-20'),
    assignee: 'Алексей'
  },
  {
    id: '2',
    title: 'Настроить WebSocket сервер',
    description: 'Реализовать real-time синхронизацию между клиентами',
    status: 'in-progress',
    priority: 'high',
    tags: ['websocket', 'backend'],
    createdAt: new Date('2024-01-16'),
    deadline: new Date('2024-01-18'),
    assignee: 'Мария'
  },
  {
    id: '3',
    title: 'Разработать UI компоненты',
    description: 'Создать переиспользуемые компоненты на React + Tailwind',
    status: 'in-progress',
    priority: 'medium',
    tags: ['frontend', 'ui'],
    createdAt: new Date('2024-01-16'),
    deadline: new Date('2024-01-19'),
    assignee: 'Дмитрий'
  },
  {
    id: '4',
    title: 'Написать документацию',
    description: 'Подготовить README с инструкцией по запуску',
    status: 'todo',
    priority: 'low',
    tags: ['documentation'],
    createdAt: new Date('2024-01-17'),
    deadline: new Date('2024-01-21'),
    assignee: 'Анна'
  },
  {
    id: '5',
    title: 'Развернуть на сервере',
    description: 'Настроить Docker Compose и деплой',
    status: 'done',
    priority: 'medium',
    tags: ['devops', 'deployment'],
    createdAt: new Date('2024-01-14'),
    deadline: new Date('2024-01-17'),
    assignee: 'Олег'
  }
];