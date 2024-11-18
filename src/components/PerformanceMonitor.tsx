import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Minimize2, Maximize2 } from 'lucide-react';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [frameTime, setFrameTime] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const maxHistory = 30;

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let frameTimeTotal = 0;
    let lastFrameTime = performance.now();

    const updateStats = () => {
      const now = performance.now();
      const delta = now - lastTime;
      
      const currentFrameTime = now - lastFrameTime;
      frameTimeTotal += currentFrameTime;
      lastFrameTime = now;
      
      if (delta >= 1000) {
        const currentFps = Math.round((frames * 1000) / delta);
        const avgFrameTime = frameTimeTotal / frames;
        
        setFps(currentFps);
        setFrameTime(avgFrameTime);
        setHistory(prev => [...prev.slice(-maxHistory + 1), currentFps]);
        
        frames = 0;
        frameTimeTotal = 0;
        lastTime = now;
      }
      
      frames++;
      requestAnimationFrame(updateStats);
    };

    const handle = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(handle);
  }, []);

  const getColor = (value: number) => {
    if (value >= 55) return '#44ff88';
    if (value >= 30) return '#ffd700';
    return '#ff4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      drag
      dragMomentum={false}
      className="fixed top-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-2 font-mono text-[10px] z-50 cursor-move select-none"
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getColor(fps) }} />
        <span className="text-white/60">FPS:</span>
        <span className="text-white font-medium">{fps}</span>
        <span className="text-white/60 ml-1">Frame:</span>
        <span className="text-white font-medium">{frameTime.toFixed(1)}ms</span>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="ml-1 text-white/60 hover:text-white"
        >
          {isMinimized ? (
            <Maximize2 size={12} />
          ) : (
            <Minimize2 size={12} />
          )}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="w-32 h-16 relative mt-2">
          <div className="absolute inset-0 flex items-end gap-px">
            {history.map((value, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(value / 60) * 100}%` }}
                className="w-1 rounded-t"
                style={{ backgroundColor: getColor(value) }}
              />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-cols-1 grid-rows-3 pointer-events-none">
            {[60, 30, 0].map((value, i) => (
              <div key={i} className="border-t border-white/10 relative">
                <span className="absolute -top-1 -left-4 text-white/40">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}