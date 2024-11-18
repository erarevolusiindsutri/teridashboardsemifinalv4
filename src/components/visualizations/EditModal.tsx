import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface EditModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    value: string | number;
    required?: boolean;
  }>;
}

export function EditModal({ title, isOpen, onClose, onSubmit, fields }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, string | number>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const requiredFields = fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-black/40 backdrop-blur-sm rounded-xl p-4 w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-sm font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-white/60 text-xs mb-1">{field.label}</label>
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4488ff]"
                required={field.required}
                min={field.type === 'number' ? 0 : undefined}
                step={field.type === 'number' ? 0.01 : undefined}
              />
            </div>
          ))}

          {error && (
            <div className="text-[#ff4444] text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#4488ff] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#4488ff]/90"
          >
            Save Changes
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}