// src/App.tsx
import { useState } from 'react';
import KanbanBoard from './Components/Kanban/KanbanBoard';
import { mockTasks } from './data/mockData';
import { type Task } from './types/task';

function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const addTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                TaskFlow
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Канбан-доска для управления задачами
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  Активных задач
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status !== 'done').length}
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                АД
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KanbanBoard
          tasks={tasks}
          onUpdateTask={updateTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
        />
      </main>
    </div>
  );
}

export default App;