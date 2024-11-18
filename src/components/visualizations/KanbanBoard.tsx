import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';

interface KanbanBoardProps {
  projectId: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
  }>;
  onUpdateTask?: (taskId: string, updates: any) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

export function KanbanBoard({ projectId, tasks, onUpdateTask, onDeleteTask }: KanbanBoardProps) {
  const columns = [
    { id: 'todo', title: 'To Do', color: '#4488ff' },
    { id: 'in-progress', title: 'In Progress', color: '#ffd700' },
    { id: 'done', title: 'Done', color: '#44ff88' }
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: 'todo' | 'in-progress' | 'done') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (onUpdateTask) {
      await onUpdateTask(taskId, { status });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map(column => (
        <div
          key={column.id}
          className="bg-white/5 rounded-lg p-3"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id as any)}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
            <h3 className="text-white text-sm font-medium">{column.title}</h3>
            <span className="text-white/40 text-xs">
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </div>

          <div className="space-y-2">
            {tasks
              .filter(task => task.status === column.id)
              .map(task => (
                <motion.div
                  key={task.id}
                  className="bg-white/10 rounded-lg p-3 cursor-move group relative"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-white text-sm font-medium mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-white/60 text-xs">{task.description}</p>
                  )}
                  
                  {(onUpdateTask || onDeleteTask) && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {onDeleteTask && (
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-white/40 hover:text-[#ff4444] transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}