import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Box, ArrowUpRight, Layers, Plus } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { ProductVisualization } from './ProductVisualization';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';
import { AnimatedCounter } from './AnimatedCounter';
import { useDataStore } from '../../lib/dataManager';

export function ProductOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);
  const { productData, addProject } = useDataStore();

  useEffect(() => {
    setIsVisible(selectedUnit === 'product');
    if (selectedUnit !== 'product') {
      setSelectedProject(null);
    }
  }, [selectedUnit]);

  const handleClose = () => {
    setIsVisible(false);
    useDashboardStore.getState().setSelectedUnit(null);
  };

  const handleAddProject = async (data: any) => {
    await addProject({
      name: data.name,
      client: data.client,
      modules: data.modules,
      status: 'proposal'
    });
    setShowAddModal(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Main Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="fixed left-4 top-4 z-50 w-[280px]"
          >
            <motion.div
              className="rounded-xl bg-black/40 backdrop-blur-sm p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-[#44ff88]/20 flex items-center justify-center">
                    <Box size={12} className="text-[#44ff88]" />
                  </div>
                  <h2 className="text-[#44ff88] text-sm font-medium">Project Overview</h2>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowAddModal(true)}
                    className="text-white/80 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={16} />
                  </motion.button>
                  <motion.button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <motion.div 
                  className="bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Layers size={12} className="text-[#4488ff]" />
                    <span className="text-white/60 text-xs">Active Projects</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    <AnimatedCounter value={productData.metrics.activeProjects} />
                  </div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>{productData.projects.filter(p => p.status === 'active').length} in progress</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-black/20 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Box size={12} className="text-[#44ff88]" />
                    <span className="text-white/60 text-xs">Proposals</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    <AnimatedCounter value={productData.metrics.proposals} />
                  </div>
                  <div className="flex items-center gap-1 text-[#44ff88] text-xs">
                    <ArrowUpRight size={12} />
                    <span>{productData.projects.filter(p => p.status === 'proposal').length} pending</span>
                  </div>
                </motion.div>
              </div>

              <div className="h-[200px] rounded-lg mb-4 overflow-hidden bg-black/20">
                <ProductVisualization onProjectSelect={setSelectedProject} />
              </div>

              <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                <div className="space-y-2">
                  {productData.projects.length === 0 ? (
                    <div className="text-white/60 text-center py-4">No projects yet</div>
                  ) : productData.projects.map((project, index) => (
                    <motion.button
                      key={project.id}
                      className="w-full flex items-center justify-between text-white bg-black/20 hover:bg-black/30 rounded-lg p-2 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedProject(project.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: project.status === 'active' ? '#44ff88' : '#666666' 
                          }} 
                        />
                        <div className="text-xs text-left">{project.name}</div>
                      </div>
                      <div 
                        className="text-xs"
                        style={{ 
                          color: project.status === 'active' ? '#44ff88' : '#666666'
                        }}
                      >
                        {project.status}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className="fixed right-4 top-4 z-50 w-[400px] max-h-[calc(100vh-2rem)] flex flex-col"
              >
                <motion.div
                  className="flex-1 bg-black/40 backdrop-blur-sm rounded-xl p-6 overflow-y-auto custom-scrollbar"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-lg font-medium">Add New Project</h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-white/80 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddProject({
                      name: formData.get('name'),
                      client: formData.get('client'),
                      modules: Array.from(formData.getAll('modules'))
                    });
                  }} className="space-y-6">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Project Name</label>
                      <input
                        type="text"
                        name="name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4488ff] focus:ring-1 focus:ring-[#4488ff]"
                        placeholder="Enter project name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Client</label>
                      <input
                        type="text"
                        name="client"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4488ff] focus:ring-1 focus:ring-[#4488ff]"
                        placeholder="Enter client name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-3">Project Modules</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['sales', 'customer-service', 'data', 'operation'].map((module) => (
                          <label key={module} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                            <input
                              type="checkbox"
                              name="modules"
                              value={module}
                              className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#4488ff] focus:ring-[#4488ff] focus:ring-offset-0"
                            />
                            <span className="text-white text-sm capitalize">
                              {module.replace('-', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#4488ff] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#4488ff]/90 transition-colors"
                    >
                      Create Project
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <ProjectDetailsPanel 
            projectId={selectedProject || ''}
            isVisible={selectedProject !== null}
            onClose={() => setSelectedProject(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}