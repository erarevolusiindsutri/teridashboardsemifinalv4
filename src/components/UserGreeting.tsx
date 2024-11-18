import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';

export function UserGreeting() {
  const { user } = useAuth();

  if (!user?.email) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 text-white/60 text-sm z-50 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2"
    >
      Hello, {user.email.split('@')[0]}
    </motion.div>
  );
}