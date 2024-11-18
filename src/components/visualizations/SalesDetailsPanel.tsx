import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, Users, Building2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDataStore } from '../../lib/dataManager';
import { DataControls } from './DataControls';
import { EditModal } from './EditModal';

interface SalesDetailsPanelProps {
  type: 'leads' | 'meetings' | 'deals';
  isVisible: boolean;
  onClose: () => void;
}

export function SalesDetailsPanel({ type, isVisible, onClose }: SalesDetailsPanelProps) {
  const salesData = useDataStore((state) => state.salesData);
  const { editLead, removeLead, editDeal, removeDeal } = useDataStore();
  const [editItem, setEditItem] = useState<any>(null);
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

  const handleEdit = (item: any) => {
    setEditItem(item);
  };

  const handleDelete = async (id: string) => {
    if (type === 'leads') {
      await removeLead(id);
    } else if (type === 'deals') {
      await removeDeal(id);
    }
  };

  const handleSubmitEdit = async (data: any) => {
    if (!editItem) return;

    if (type === 'leads') {
      await editLead(editItem.id, data);
    } else if (type === 'deals') {
      await editDeal(editItem.id, data);
    }
    setEditItem(null);
  };

  const renderContent = () => {
    switch (type) {
      case 'leads':
        return salesData.leads.recent.length === 0 ? (
          <div className="text-white/60 text-center py-4">No leads yet</div>
        ) : (
          salesData.leads.recent.map((lead, index) => (
            <motion.div
              key={`${lead.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-3 relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-medium text-sm">{lead.name}</div>
                  <div className="flex items-center gap-1 text-white/60 text-xs">
                    <Building2 size={12} />
                    {lead.company}
                  </div>
                </div>
                <div className="text-xs font-medium text-[#4488ff]">{lead.status}</div>
              </div>
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <Clock size={12} />
                {lead.time}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DataControls
                  onEdit={() => handleEdit(lead)}
                  onDelete={() => handleDelete(lead.id)}
                />
              </div>
            </motion.div>
          ))
        );

      case 'meetings':
        return salesData.meetings.upcoming.length === 0 ? (
          <div className="text-white/60 text-center py-4">No meetings scheduled</div>
        ) : (
          salesData.meetings.upcoming.map((meeting, index) => (
            <motion.div
              key={`${meeting.company}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-medium text-sm">{meeting.name}</div>
                  <div className="flex items-center gap-1 text-white/60 text-xs">
                    <Building2 size={12} />
                    {meeting.company}
                  </div>
                </div>
                <div className={`text-xs font-medium ${
                  meeting.status === 'scheduled' ? 'text-[#44ff88]' : 
                  meeting.status === 'completed' ? 'text-[#4488ff]' : 
                  'text-[#ff4444]'
                }`}>
                  {meeting.status}
                </div>
              </div>
              <div className="flex items-center justify-between text-white/40 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {meeting.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {meeting.time}
                </div>
              </div>
            </motion.div>
          ))
        );

      case 'deals':
        return salesData.deals.recent.length === 0 ? (
          <div className="text-white/60 text-center py-4">No deals yet</div>
        ) : (
          salesData.deals.recent.map((deal, index) => (
            <motion.div
              key={`${deal.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-3 relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-medium text-sm">{deal.name}</div>
                  <div className="flex items-center gap-1 text-white/60 text-xs">
                    <Building2 size={12} />
                    {deal.company}
                  </div>
                </div>
                <div className="text-sm font-medium text-[#44ff88]">
                  ${deal.value.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white/40 text-xs">
                  <Calendar size={12} />
                  {deal.date}
                </div>
                <div className={`text-xs font-medium ${
                  deal.status === 'won' ? 'text-[#44ff88]' : 'text-[#ff4444]'
                }`}>
                  {deal.status}
                </div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DataControls
                  onEdit={() => handleEdit(deal)}
                  onDelete={() => handleDelete(deal.id)}
                />
              </div>
            </motion.div>
          ))
        );
    }
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
              <h2 className="text-[#4488ff] text-sm font-medium">
                {type === 'leads' ? 'New Leads' : 
                 type === 'meetings' ? 'Scheduled Meetings' : 
                 'Closed Deals'}
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
              {renderContent()}
            </div>
          </motion.div>

          <AnimatePresence>
            {editItem && (
              <EditModal
                title={`Edit ${type === 'leads' ? 'Lead' : 'Deal'}`}
                isOpen={true}
                onClose={() => setEditItem(null)}
                onSubmit={handleSubmitEdit}
                fields={
                  type === 'leads' ? [
                    { name: 'name', label: 'Name', type: 'text', value: editItem.name, required: true },
                    { name: 'company', label: 'Company', type: 'text', value: editItem.company, required: true },
                    { name: 'status', label: 'Status', type: 'text', value: editItem.status, required: true }
                  ] : [
                    { name: 'name', label: 'Name', type: 'text', value: editItem.name, required: true },
                    { name: 'company', label: 'Company', type: 'text', value: editItem.company, required: true },
                    { name: 'value', label: 'Value', type: 'number', value: editItem.value, required: true },
                    { name: 'status', label: 'Status', type: 'text', value: editItem.status, required: true }
                  ]
                }
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}