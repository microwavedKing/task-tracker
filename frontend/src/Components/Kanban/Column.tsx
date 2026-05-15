// src/components/Column.tsx
import { useDroppable } from '@dnd-kit/core';
import { type Task, type Column as ColumnType } from '../../types/task';
import SortableTaskCard from './SortableTaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column = ({ column, tasks, onEditTask, onDeleteTask }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  });

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...tasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="shrink-0 w-96">
      {/* Заголовок колонки */}
      <div className={`${column.bgColor} rounded-t-lg border-t-4 ${column.borderColor} p-3`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{column.title}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              column.id === 'todo' ? 'bg-blue-100 text-blue-700' :
              column.id === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {tasks.length}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Тело колонки (принимающая зона) */}
      <div
        ref={setNodeRef}
        className={`${column.bgColor} rounded-b-lg p-3 min-h-[600px] transition-colors ${
          isOver ? 'ring-2 ring-blue-400 ring-inset bg-blue-100 bg-opacity-30' : ''
        }`}
      >
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 5h18a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-400">Нет задач</p>
              <p className="text-xs text-gray-400">Нажмите "+" чтобы создать</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;