import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', className = '' }: AnimatedCounterProps) {
  const spring = useSpring(0, {
    stiffness: 80,
    damping: 20,
    duration: 0.5
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}