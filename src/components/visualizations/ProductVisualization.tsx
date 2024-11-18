import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useDataStore } from '../../lib/dataManager';

interface ProductVisualizationProps {
  onProjectSelect: (projectId: string) => void;
}

interface TeriModule {
  id: 'sales' | 'customer-service' | 'data' | 'operation';
  name: string;
  color: string;
}

const TERI_MODULES: TeriModule[] = [
  { id: 'sales', name: 'T.E.R.I Sales', color: '#4488ff' },
  { id: 'customer-service', name: 'T.E.R.I Customer Service', color: '#44ff88' },
  { id: 'data', name: 'T.E.R.I Data', color: '#ff4444' },
  { id: 'operation', name: 'T.E.R.I Operation', color: '#ffd700' }
];

export function ProductVisualization({ onProjectSelect }: ProductVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredProjectRef = useRef<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const { projects } = useDataStore((state) => state.productData);

  const bind = useDrag(({ movement: [mx, my], first, last }) => {
    if (first) setIsDragging(true);
    if (last) {
      setIsDragging(false);
      setTimeout(() => {
        hoveredProjectRef.current = null;
      }, 0);
    }
    setOffset({ x: mx, y: my });
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawModule = (x: number, y: number, module: TeriModule, isActive: boolean) => {
      const size = 8;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      ctx.shadowColor = module.color;
      ctx.shadowBlur = isActive ? 15 : 5;
      ctx.fillStyle = `${module.color}${isActive ? '80' : '40'}`;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawConnection = (x1: number, y1: number, x2: number, y2: number, color: string, active: boolean) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `${color}${active ? '60' : '20'}`;
      ctx.lineWidth = active ? 1.5 : 0.75;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(offset.x, offset.y);

      const moduleSpacing = canvas.width / (TERI_MODULES.length + 1);
      TERI_MODULES.forEach((module, i) => {
        const x = moduleSpacing * (i + 1);
        const y = 25;
        drawModule(x, y, module, true);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '8px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(module.name.split(' ')[1], x, y + 16);
      });

      if (projects.length === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No projects yet', canvas.width / 2, canvas.height / 2);
      } else {
        const projectSpacing = canvas.width / (projects.length + 1);
        projects.forEach((project, i) => {
          const projectX = projectSpacing * (i + 1);
          const projectY = 90;

          project.modules.forEach(moduleId => {
            const moduleIndex = TERI_MODULES.findIndex(m => m.id === moduleId);
            if (moduleIndex !== -1) {
              const moduleX = moduleSpacing * (moduleIndex + 1);
              const moduleY = 25;
              
              drawConnection(
                projectX, projectY,
                moduleX, moduleY,
                TERI_MODULES[moduleIndex].color,
                project.status === 'active'
              );
            }
          });

          const isHovered = hoveredProjectRef.current === project.id;
          ctx.beginPath();
          ctx.arc(projectX, projectY, isHovered ? 5 : 4, 0, Math.PI * 2);
          ctx.shadowColor = project.status === 'active' ? '#44ff88' : '#666666';
          ctx.shadowBlur = isHovered ? 15 : (project.status === 'active' ? 10 : 5);
          ctx.fillStyle = project.status === 'active' ? '#ffffff' : '#666666';
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = project.status === 'active' ? '#ffffff' : '#666666';
          ctx.font = '9px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(project.name, projectX, projectY + 15);
        });
      }

      ctx.restore();
    };

    const handleClick = (event: MouseEvent) => {
      if (isDragging || !projects.length) return;

      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width) - offset.x;
      const y = (event.clientY - rect.top) * (canvas.height / rect.height) - offset.y;

      const projectSpacing = canvas.width / (projects.length + 1);
      projects.forEach((project, i) => {
        const projectX = projectSpacing * (i + 1);
        const projectY = 90;
        
        const distance = Math.sqrt(
          Math.pow(x - projectX, 2) + Math.pow(y - projectY, 2)
        );

        if (distance < 15) {
          onProjectSelect(project.id);
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging || !projects.length) return;

      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width) - offset.x;
      const y = (event.clientY - rect.top) * (canvas.height / rect.height) - offset.y;

      let hoveredProject: string | null = null;
      const projectSpacing = canvas.width / (projects.length + 1);
      
      projects.forEach((project, i) => {
        const projectX = projectSpacing * (i + 1);
        const projectY = 90;
        
        const distance = Math.sqrt(
          Math.pow(x - projectX, 2) + Math.pow(y - projectY, 2)
        );

        if (distance < 15) {
          hoveredProject = project.id;
          canvas.style.cursor = 'pointer';
        }
      });

      if (hoveredProject !== hoveredProjectRef.current) {
        hoveredProjectRef.current = hoveredProject;
        canvas.style.cursor = hoveredProject ? 'pointer' : 'grab';
        render();
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      render();
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);
    resize();

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [onProjectSelect, offset, isDragging, projects]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ touchAction: 'none' }}
      {...bind()}
    />
  );
}