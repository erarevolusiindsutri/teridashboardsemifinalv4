import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, TrendingUp, ArrowUpRight, Star } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { useDataStore } from '../../lib/dataManager';
import { SalesVisualization } from './SalesVisualization';
import { SalesDetailsPanel } from './SalesDetailsPanel';
import { AnimatedCounter } from './AnimatedCounter';

export function SalesOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'lead' | 'deal'>('lead');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedUnit = useDashboardStore((state) => state.selectedUnit);
  const { salesData, addLead, addDeal } = useDataStore();

  useEffect(() => {
    setIsVisible(selectedUnit === 'sales');
    if (selectedUnit !== 'sales') {
      setShowAddModal(false);
      setModalType('lead');
    }
  }, [selectedUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!name || !company) {
        throw new Error('Please fill in all required fields');
      }

      if (modalType === 'lead') {
        await addLead({
          name,
          company,
          status: 'New'
        });
      } else {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue <= 0) {
          throw new Error('Please enter a valid value greater than 0');
        }
        await addDeal({
          name,
          company,
          value: numericValue,
          status: 'won',
          date: new Date().toISOString()
        });
      }

      // Reset form
      setName('');
      setCompany('');
      setValue('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    useDashboardStore.getState().setSelectedUnit(null);
  };

  const handleDetailsClick = (type: 'lead' | 'deal') => {
    setModalType(type);
    setShowAddModal(true);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
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
                  <div className="w-4 h-4 rounded-sm bg-[#4488ff]/20 flex items-center justify-center">
                    <TrendingUp size={12} className="text-[#4488ff]" />
                  </div>
                  <h2 className="text-[#4488ff] text-sm font-medium">Sales Overview</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <motion.div 
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AnimatedCounter value={salesData.totalRevenue} prefix="$" />
              </motion.div>

              <div className="relative h-[180px] rounded-lg mb-4 overflow-hidden">
                <SalesVisualization modalType={modalType} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('lead')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#4488ff]" />
                    <span className="text-white/60 text-xs">New Leads</span>
                  </motion.div>
                  <motion.div 
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AnimatedCounter value={salesData.leads.count} />
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1 text-[#44ff88] text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ArrowUpRight size={12} />
                    <span>{(salesData.leads.trend * 100).toFixed(1)}%</span>
                  </motion.div>
                </motion.button>

                <motion.button 
                  className="text-left"
                  onClick={() => handleDetailsClick('deal')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Star className="w-2 h-2 text-[#ffd700]" />
                    <span className="text-white/60 text-xs">Closed</span>
                  </motion.div>
                  <motion.div 
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedCounter value={salesData.deals.count} />
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1 text-[#44ff88] text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <ArrowUpRight size={12} />
                    <span>{(salesData.deals.trend * 100).toFixed(1)}%</span>
                  </motion.div>
                </motion.button>
              </div>

              <div className="space-y-2">
                {salesData.leads.recent.slice(0, 2).map((lead, index) => (
                  <motion.div 
                    key={`${lead.company}-${index}`}
                    className="flex items-center justify-between text-white bg-black/20 rounded-lg p-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#4488ff]" />
                      <div className="text-xs">New lead: {lead.company}</div>
                    </div>
                    <div className="text-xs text-white/60">{lead.time}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-4 w-[280px]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-sm font-medium">
                      Add {modalType === 'lead' ? 'Lead' : 'Deal'}
                    </h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-white/80 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4488ff]"
                        placeholder="Enter name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 text-xs mb-1">Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4488ff]"
                        placeholder="Enter company"
                        required
                      />
                    </div>

                    {modalType === 'deal' && (
                      <div>
                        <label className="block text-white/60 text-xs mb-1">Value</label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4488ff]"
                          placeholder="Enter value"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    )}

                    {error && (
                      <div className="text-[#ff4444] text-xs">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {modalType === 'lead' && (
                        <button
                          type="button"
                          onClick={() => setModalType('deal')}
                          className="flex-1 bg-white/10 text-white rounded-lg py-2 text-sm font-medium hover:bg-white/20"
                        >
                          Switch to Deal
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#4488ff] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#4488ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
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