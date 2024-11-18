import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SalesVisualizationProps {
  detailsType: 'leads' | 'meetings' | 'deals' | null;
}

const mockData = {
  meetings: {
    '2024-03-01': [{ time: '14:30', company: 'AWS' }],
    '2024-03-02': [{ time: '16:00', company: 'Google' }],
    '2024-03-05': [{ time: '11:30', company: 'Oracle' }],
    '2024-03-08': [{ time: '15:00', company: 'Microsoft' }],
  },
  leads: {
    '2024-03-01': 3,
    '2024-03-02': 1,
    '2024-03-04': 4,
    '2024-03-06': 2,
    '2024-03-07': 1,
    '2024-03-09': 2,
    '2024-03-11': 3,
    '2024-03-12': 2,
    '2024-03-14': 1,
    '2024-03-15': 3,
  },
  deals: {
    '2024-03-03': { value: 15000, company: 'Shopify' },
    '2024-03-07': { value: 8500, company: 'Atlassian' },
    '2024-03-10': { value: 12000, company: 'Salesforce' },
    '2024-03-13': { value: 9500, company: 'Twitter' },
  }
};

const getLeadColor = (count: number, isHighlighted: boolean): string => {
  const alpha = isHighlighted ? 1 : 0.5;
  if (count === 0) return `rgba(68, 136, 255, ${alpha * 0.1})`;
  if (count === 1) return `rgba(68, 136, 255, ${alpha * 0.3})`;
  if (count === 2) return `rgba(68, 136, 255, ${alpha * 0.5})`;
  if (count === 3) return `rgba(68, 136, 255, ${alpha * 0.7})`;
  return `rgba(68, 136, 255, ${alpha * 0.9})`;
};

const getLeadGlow = (count: number, isHighlighted: boolean): number => {
  const multiplier = isHighlighted ? 1.5 : 1;
  if (count === 0) return 0;
  if (count === 1) return 4 * multiplier;
  if (count === 2) return 8 * multiplier;
  if (count === 3) return 12 * multiplier;
  return 16 * multiplier;
};

export function SalesVisualization({ detailsType }: SalesVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCalendar = () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      
      const cellSize = 24;
      const cellPadding = 3;
      const totalSize = cellSize + cellPadding;
      const startX = 10;
      const startY = 25;

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw day labels
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px Inter';
      ctx.textAlign = 'center';
      days.forEach((day, i) => {
        ctx.fillText(day, startX + i * totalSize + cellSize/2, startY - 8);
      });

      let day = 1;
      const rows = Math.ceil((daysInMonth + firstDay) / 7);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < 7; col++) {
          if (row === 0 && col < firstDay) continue;
          if (day > daysInMonth) break;

          const x = startX + (col * totalSize);
          const y = startY + (row * totalSize);
          const dateStr = `2024-03-${day.toString().padStart(2, '0')}`;
          
          // Draw base cell
          ctx.fillStyle = 'rgba(68, 136, 255, 0.05)';
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = 'rgba(68, 136, 255, 0.1)';
          ctx.strokeRect(x, y, cellSize, cellSize);

          // Draw leads indicator (blue dots)
          const leadCount = mockData.leads[dateStr] || 0;
          if (leadCount > 0 && (!detailsType || detailsType === 'leads')) {
            const isHighlighted = detailsType === 'leads';
            ctx.shadowColor = '#4488ff';
            ctx.shadowBlur = getLeadGlow(leadCount, isHighlighted);
            ctx.fillStyle = getLeadColor(leadCount, isHighlighted);
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.shadowBlur = 0;
          }

          // Draw meeting indicator (green dot)
          if (mockData.meetings[dateStr] && (!detailsType || detailsType === 'meetings')) {
            const isHighlighted = detailsType === 'meetings';
            ctx.beginPath();
            ctx.arc(x + cellSize - 6, y + 6, 2, 0, Math.PI * 2);
            ctx.fillStyle = isHighlighted ? '#44ff88' : 'rgba(68, 255, 136, 0.5)';
            ctx.shadowColor = '#44ff88';
            ctx.shadowBlur = isHighlighted ? 8 : 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Draw deals indicator (gold star)
          if (mockData.deals[dateStr] && (!detailsType || detailsType === 'deals')) {
            const isHighlighted = detailsType === 'deals';
            ctx.beginPath();
            const centerX = x + cellSize - 6;
            const centerY = y + cellSize - 6;
            const spikes = 5;
            const outerRadius = 4;
            const innerRadius = 2;

            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / spikes - Math.PI / 2;
              const pointX = centerX + Math.cos(angle) * radius;
              const pointY = centerY + Math.sin(angle) * radius;
              
              if (i === 0) {
                ctx.moveTo(pointX, pointY);
              } else {
                ctx.lineTo(pointX, pointY);
              }
            }
            
            ctx.closePath();
            ctx.fillStyle = isHighlighted ? '#ffd700' : 'rgba(255, 215, 0, 0.5)';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = isHighlighted ? 8 : 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Draw day number
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '10px Inter';
          ctx.textAlign = 'left';
          ctx.fillText(day.toString(), x + 4, y + 16);

          // Highlight current day
          if (day === now.getDate()) {
            ctx.strokeStyle = '#44ff88';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, cellSize, cellSize);
            ctx.lineWidth = 1;
          }

          day++;
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCalendar();
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
  }, [detailsType, selectedDate]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}