import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <User size={16} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute right-0 mt-2 w-48 rounded-xl bg-black/40 backdrop-blur-sm p-2 shadow-lg"
            >
              <div className="space-y-1">
                <button
                  onClick={() => {
                    // TODO: Implement settings
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#ff4444] hover:bg-white/10 rounded-lg"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}