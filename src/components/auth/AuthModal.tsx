import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-black/40 backdrop-blur-sm rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg font-medium">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#4488ff]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#4488ff]"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-[#ff4444] text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4488ff] text-white rounded-lg py-2 font-medium hover:bg-[#4488ff]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>

              <div className="mt-4 text-center text-white/60 text-sm">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-[#4488ff] hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-[#4488ff] hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}