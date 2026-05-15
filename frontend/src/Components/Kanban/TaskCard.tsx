// src/components/TaskCard.tsx
import { type Task } from '../../types/task';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const priorityColors = {
    high: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'Высокий'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      label: 'Средний'
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      label: 'Низкий'
    }
  };

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';

  const priority = priorityColors[task.priority];

  return (
    <div 
      onClick={onEdit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Заголовок и приоритет */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
          {task.title}
        </h4>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priority.bg} ${priority.text} ml-2 flex-shrink-0`}>
          {priority.label}
        </span>
      </div>

      {/* Описание */}
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Теги */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Нижняя панель */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-3">
          {/* Дедлайн */}
          {task.deadline && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={isOverdue ? 'font-medium' : ''}>
                {format(new Date(task.deadline), 'dd MMM', { locale: ru })}
                {isOverdue && ' (просрочен)'}
              </span>
            </div>
          )}

          {/* Исполнитель */}
          {task.assignee && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{task.assignee}</span>
            </div>
          )}
        </div>

        {/* Кнопки действий (появляются при ховере) */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-400 hover:text-red-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;