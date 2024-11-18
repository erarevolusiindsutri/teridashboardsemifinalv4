import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, CheckCircle2, Clock, Package, Bot, ArrowUpRight, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDataStore } from '../../lib/dataManager';
import { taskManager } from '../../lib/taskManager';
import { KanbanBoard } from './KanbanBoard';

interface ProjectDetailsPanelProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}

export function ProjectDetailsPanel({ projectId, isVisible, onClose }: ProjectDetailsPanelProps) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { productData } = useDataStore();
  const project = productData.projects.find(p => p.id === projectId);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (projectId && isVisible) {
      loadTasks();
    }
  }, [projectId, isVisible]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const projectTasks = await taskManager.fetchTasks(projectId);
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      setIsLoading(true);
      await taskManager.createTask(projectId, newTask);
      await loadTasks(); // Reload tasks after adding
      setNewTask({ title: '', description: '', status: 'todo' });
      setShowAddTask(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      setIsLoading(true);
      await taskManager.updateTask(taskId, updates);
      await loadTasks(); // Reload tasks after updating
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await taskManager.deleteTask(taskId);
      await loadTasks(); // Reload tasks after deleting
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const panelWidth = viewportWidth < 640 ? '85vw' : '600px';
  const maxHeight = viewportHeight - 32;

  if (!project) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="fixed right-4 top-4 z-50"
            style={{ width: panelWidth }}
          >
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-xl p-6"
              style={{ maxHeight }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-white text-lg font-medium mb-1">{project.name}</h2>
                  <div className="text-white/60 text-sm flex items-center gap-2">
                    <span>{project.client}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className={project.status === 'active' ? 'text-[#44ff88]' : 'text-white/40'}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowAddTask(true)}
                    className="text-white/80 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={20} />
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="text-white/80 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div 
                className="space-y-4 overflow-y-auto custom-scrollbar pr-2" 
                style={{ maxHeight: maxHeight - 120 }}
              >
                {isLoading ? (
                  <div className="text-white/60 text-center py-4">
                    Loading tasks...
                  </div>
                ) : tasks.length > 0 ? (
                  <KanbanBoard 
                    projectId={projectId} 
                    tasks={tasks}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ) : (
                  <div className="text-white/60 text-center py-4">
                    No tasks yet. Click the + button to add one.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showAddTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowAddTask(false);
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2 }}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-6 w-[400px] m-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-lg font-medium">Add New Task</h3>
                    <motion.button
                      onClick={() => setShowAddTask(false)}
                      className="text-white/80 hover:text-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <form onSubmit={handleAddTask} className="space-y-6">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Title</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4488ff] focus:ring-1 focus:ring-[#4488ff]"
                        placeholder="Enter task title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Description</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4488ff] focus:ring-1 focus:ring-[#4488ff] resize-none"
                        placeholder="Enter task description"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Status</label>
                      <select
                        value={newTask.status}
                        onChange={(e) => setNewTask(prev => ({ 
                          ...prev, 
                          status: e.target.value as 'todo' | 'in-progress' | 'done'
                        }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4488ff] focus:ring-1 focus:ring-[#4488ff]"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#4488ff] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#4488ff]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating...' : 'Create Task'}
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}