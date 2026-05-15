// src/components/KanbanBoard.tsx
import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { columns } from '../../data/mockData';
import { type Task, type Status } from '../../types/task';
import Column from './Column';
import SortableTaskCard from '../../Components/Kanban/SortableTaskCard';
import TaskModal from './TaskModal';
import CreateTaskButton from './CreateTaskButton';
import toast from 'react-hot-toast';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanBoard = ({ tasks, onUpdateTask, onAddTask, onDeleteTask }: KanbanBoardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Синхронизация локальных задач с пропсами
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const getTasksByStatus = (status: Status) => {
    return localTasks.filter(task => task.status === status);
  };

  // Настройка сенсоров
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Поиск задачи по ID
  const findTaskById = (taskId: string): Task | undefined => {
    return localTasks.find(task => task.id === taskId);
  };

  // Поиск колонки по ID задачи
  const findColumnByTaskId = (taskId: string): Status | null => {
    const task = findTaskById(taskId);
    return task ? task.status : null;
  };

  // Обработчик начала перетаскивания
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    const task = findTaskById(taskId);
    
    if (task) {
      setActiveTask(task);
    }
  };

  // Обработчик перетаскивания над элементом
  const handleDragOver = (event: DragOverEvent) => {
    // Можно добавить визуальные эффекты при наведении
  };

  // Обработчик завершения перетаскивания
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Определяем целевую колонку
    let targetStatus: Status | null = null;
    
    // Проверяем, является ли цель колонкой
    if (columns.find(col => col.id === overId)) {
      targetStatus = overId as Status;
    } else {
      // Если цель - задача, находим её колонку
      const taskOver = findTaskById(overId);
      if (taskOver) {
        targetStatus = taskOver.status;
      }
    }
    
    if (!targetStatus) return;
    
    const sourceColumn = findColumnByTaskId(activeId);
    if (!sourceColumn) return;
    
    // Перемещение между колонками
    if (sourceColumn !== targetStatus) {
      const movedTask = findTaskById(activeId);
      if (!movedTask) return;
      
      const updatedTask = { ...movedTask, status: targetStatus };
      
      // Оптимистичное обновление UI
      setLocalTasks(prev =>
        prev.map(task =>
          task.id === activeId ? { ...task, status: targetStatus } : task
        )
      );
      
      try {
        onUpdateTask(updatedTask);
        const targetColumn = columns.find(c => c.id === targetStatus);
        toast.success(`Задача перемещена в ${targetColumn?.title}`);
      } catch (error) {
        setLocalTasks(tasks);
        toast.error('Ошибка при перемещении задачи');
      }
    } 
    // Переупорядочивание внутри одной колонки
    else {
      const columnTasks = getTasksByStatus(sourceColumn);
      const oldIndex = columnTasks.findIndex(task => task.id === activeId);
      const newIndex = columnTasks.findIndex(task => task.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
        
        setLocalTasks(prev => {
          const otherTasks = prev.filter(task => task.status !== sourceColumn);
          return [...otherTasks, ...reorderedTasks];
        });
        
        toast.success('Порядок задач обновлён');
      }
    }
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
      onUpdateTask({ ...editingTask, ...taskData } as Task);
      toast.success('Задача обновлена');
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title || 'Новая задача',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        tags: taskData.tags || [],
        createdAt: new Date(),
        deadline: taskData.deadline || null,
        assignee: taskData.assignee,
      };
      onAddTask(newTask);
      toast.success('Задача создана');
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={getTasksByStatus(column.id).map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <Column
                column={column}
                tasks={getTasksByStatus(column.id)}
                onEditTask={handleEditTask}
                onDeleteTask={onDeleteTask}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="transform rotate-2 scale-105 opacity-90 shadow-2xl">
              <div className="bg-white rounded-lg border-2 border-blue-400 p-4 w-80">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{activeTask.title}</h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    activeTask.priority === 'high' ? 'bg-red-100 text-red-700' :
                    activeTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activeTask.priority === 'high' ? 'Высокий' :
                     activeTask.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                </div>
                {activeTask.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{activeTask.description}</p>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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