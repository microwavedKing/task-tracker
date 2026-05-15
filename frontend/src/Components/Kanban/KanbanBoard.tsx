// src/components/KanbanBoard.tsx
import { useState } from 'react';
import { columns } from '../../data/mockData';
import { type Task, type Status } from '../../types/task';
import Column from './Column';
import TaskModal from './TaskModal';
import CreateTaskButton from './CreateTaskButton';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanBoard = ({ tasks, onUpdateTask, onAddTask, onDeleteTask }: KanbanBoardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      onUpdateTask({ ...editingTask, ...taskData } as Task);
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || 'Новая задача',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        tags: taskData.tags || [],
        createdAt: new Date(),
        deadline: taskData.deadline || null,
        assignee: taskData.assignee
      };
      onAddTask(newTask);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Канбан-доска</h2>
          <p className="text-sm text-gray-500 mt-1">
            Перетаскивайте задачи для изменения статуса
          </p>
        </div>
        <CreateTaskButton onClick={handleCreateTask} />
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByStatus(column.id)}
            onEditTask={handleEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </>
  );
};

export default KanbanBoard;