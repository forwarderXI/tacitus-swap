import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const RainCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  opacity: 0.6;
`;

export const DigitalRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[]!@#$%^&*()';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    const speeds: number[] = [];
    const brightnesses: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height / fontSize;
      speeds[i] = (0.5 + Math.random() * 1.5) / 2;
      brightnesses[i] = 0.4 + Math.random() * 0.6;
    }

    // Function to check if a position intersects with content
    const getContentOpacityFactor = (x: number, y: number): number => {
      // Reduce opacity on UI areas (optional - can be adjusted)
      if (y < 100) return 0.2; // Reduce rain opacity in header area
      return 1;
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 11, 14, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const x = i;
        const y = drops[i] * fontSize;

        // Get opacity factor based on content intersection
        const opacityFactor = getContentOpacityFactor(x, y);
        const currentBrightness = brightnesses[i] * opacityFactor;

        // Enhanced gradient effect
        const gradient = ctx.createLinearGradient(x * fontSize, y - fontSize * 4, x * fontSize, y);
        gradient.addColorStop(0, `rgba(0, 243, 255, ${currentBrightness})`);
        gradient.addColorStop(0.5, `rgba(123, 47, 247, ${currentBrightness})`);
        gradient.addColorStop(1, `rgba(0, 255, 0, ${currentBrightness * 0.5})`);

        // Draw leading character
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = `rgba(0, 243, 255, ${currentBrightness * 1.5})`;
        ctx.fillText(
          charArray[Math.floor(Math.random() * charArray.length)],
          x * fontSize,
          y
        );

        // Draw trailing characters
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = gradient;
        for (let j = 1; j < 4; j++) {
          const trailChar = charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillText(trailChar, x * fontSize, y - fontSize * j);
        }

        // Reset or update drop position
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
          speeds[i] = (0.5 + Math.random() * 1.5) / 2;
          brightnesses[i] = 0.4 + Math.random() * 0.6;
        }
        drops[i] += speeds[i];
      }
    };

    let animationFrameId: number;
    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <RainCanvas ref={canvasRef} />;
};

export default DigitalRain; 