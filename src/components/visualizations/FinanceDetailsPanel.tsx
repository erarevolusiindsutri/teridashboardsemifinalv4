import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDataStore } from '../../lib/dataManager';
import { DataControls } from './DataControls';
import { EditModal } from './EditModal';

interface FinanceDetailsPanelProps {
  type: 'moneyIn' | 'moneyOut';
  isVisible: boolean;
  onClose: () => void;
}

export function FinanceDetailsPanel({ type, isVisible, onClose }: FinanceDetailsPanelProps) {
  const financeData = useDataStore((state) => state.financeData);
  const { editTransaction, removeTransaction } = useDataStore();
  const [editItem, setEditItem] = useState<any>(null);
  const transactions = type === 'moneyIn' ? 
    financeData.moneyIn.recentTransactions : 
    financeData.moneyOut.recentTransactions;

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const panelWidth = viewportWidth < 640 ? '85vw' : '320px';
  const maxHeight = viewportHeight - 120;

  const handleEdit = (transaction: any) => {
    setEditItem(transaction);
  };

  const handleDelete = async (id: string) => {
    await removeTransaction(type, id);
  };

  const handleSubmitEdit = async (data: any) => {
    if (!editItem) return;
    await editTransaction(type, editItem.id, data);
    setEditItem(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-4 z-50"
          style={{ width: panelWidth }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-xl p-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ maxHeight }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#44ff88] text-sm font-medium">
                {type === 'moneyIn' ? 'Revenue History' : 'Expense History'}
              </h2>
              <motion.button
                onClick={onClose}
                className="text-white/80 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <div 
              className="space-y-2 overflow-y-auto custom-scrollbar pr-2" 
              style={{ maxHeight: maxHeight - 80 }}
            >
              {transactions.length === 0 ? (
                <div className="text-white/60 text-center py-4">
                  No transactions yet
                </div>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.div
                    key={`${transaction.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 rounded-lg p-3 relative group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-white font-medium text-sm">{transaction.name}</div>
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <Calendar size={12} />
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${type === 'moneyIn' ? 'text-[#4488ff]' : 'text-[#ff4444]'}`}>
                        {type === 'moneyIn' ? '+' : '-'}${transaction.amount}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DataControls
                        onEdit={() => handleEdit(transaction)}
                        onDelete={() => handleDelete(transaction.id)}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {editItem && (
              <EditModal
                title="Edit Transaction"
                isOpen={true}
                onClose={() => setEditItem(null)}
                onSubmit={handleSubmitEdit}
                fields={[
                  { name: 'name', label: 'Description', type: 'text', value: editItem.name, required: true },
                  { name: 'amount', label: 'Amount', type: 'number', value: editItem.amount, required: true },
                  { name: 'date', label: 'Date', type: 'text', value: editItem.date, required: true }
                ]}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}