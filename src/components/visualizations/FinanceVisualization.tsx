import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FinanceVisualizationProps {
  detailsType: 'moneyIn' | 'moneyOut' | null;
}

export function FinanceVisualization({ detailsType }: FinanceVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawIsometricBar = (x: number, y: number, width: number, height: number, depth: number, color: string) => {
      const isoAngle = Math.PI / 6;
      const isoSkewX = Math.cos(isoAngle);
      const isoSkewY = Math.sin(isoAngle);

      // Add glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;

      // Front face
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y - height);
      ctx.lineTo(x, y - height);
      ctx.closePath();
      ctx.fill();

      // Top face
      ctx.beginPath();
      ctx.moveTo(x, y - height);
      ctx.lineTo(x + width, y - height);
      ctx.lineTo(x + width + depth * isoSkewX, y - height - depth * isoSkewY);
      ctx.lineTo(x + depth * isoSkewX, y - height - depth * isoSkewY);
      ctx.closePath();
      ctx.fillStyle = adjustColor(color, 20);
      ctx.fill();

      // Right face
      ctx.beginPath();
      ctx.moveTo(x + width, y);
      ctx.lineTo(x + width, y - height);
      ctx.lineTo(x + width + depth * isoSkewX, y - height - depth * isoSkewY);
      ctx.lineTo(x + width + depth * isoSkewX, y - depth * isoSkewY);
      ctx.closePath();
      ctx.fillStyle = adjustColor(color, -20);
      ctx.fill();

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const adjustColor = (color: string, amount: number): string => {
      const hex = color.replace('#', '');
      const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const drawGrid = () => {
      const gridSize = 20;
      const gridRows = Math.floor(canvas.height / gridSize);
      const gridCols = Math.floor(canvas.width / gridSize);

      ctx.strokeStyle = 'rgba(68, 255, 136, 0.1)';
      ctx.lineWidth = 1;

      // Draw isometric grid
      const isoAngle = Math.PI / 6;
      const isoSkewX = Math.cos(isoAngle);
      const isoSkewY = Math.sin(isoAngle);

      // Horizontal lines
      for (let i = 0; i <= gridRows; i++) {
        const y = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let i = 0; i <= gridCols; i++) {
        const x = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + canvas.width * isoSkewX, canvas.height * isoSkewY);
        ctx.stroke();
      }

      // Diagonal lines
      for (let i = -gridCols; i <= gridRows; i++) {
        const x = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x + canvas.width * isoSkewX, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Value labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      
      const values = ['0', '200', '400', '600'];
      values.forEach((value, i) => {
        const y = canvas.height - (i * canvas.height / 4);
        ctx.fillText(value, 25, y - 5);
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid first
      drawGrid();

      const centerX = canvas.width / 2 - 45;
      const bottomY = canvas.height - 40;
      const barWidth = 30;
      const barDepth = 20;
      
      // Draw bars with isometric perspective
      const moneyInHeight = 120;
      const moneyOutHeight = 50;
      const balanceHeight = 80;

      ctx.globalAlpha = detailsType === 'moneyOut' ? 0.3 : 1;
      drawIsometricBar(centerX - 40, bottomY, barWidth, moneyInHeight, barDepth, '#4488ff');
      
      ctx.globalAlpha = detailsType === 'moneyIn' ? 0.3 : 1;
      drawIsometricBar(centerX, bottomY, barWidth, moneyOutHeight, barDepth, '#ff4444');
      
      ctx.globalAlpha = detailsType ? 0.3 : 1;
      drawIsometricBar(centerX + 40, bottomY, barWidth, balanceHeight, barDepth, '#44ff88');
      
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      render();
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, [detailsType]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}