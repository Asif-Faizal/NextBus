'use client';

import React, { useEffect, useRef } from 'react';
import { theme } from '@/theme/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  children, 
  isDarkMode = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with higher resolution for better quality
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let animationValue = 0;
    
    const drawNetworkPattern = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      // Get the appropriate color based on the theme with enhanced contrast
      const baseColor = isDarkMode 
        ? theme.colors.dark.primary
        : theme.colors.light.primary;
      
      // Convert hex to rgb for more dynamic color control
      const rgbColor = hexToRgb(baseColor);
      
      // Set up drawing styles with decreased line width for more subtle effect
      ctx.lineWidth = 1.2; // Reduced for subtlety
      
      // Adjust spacing to make the grid more stretched and extend beyond screen boundaries
      const baseSpacing = Math.min(width, height) / 3; // Decreased from 5 to make cells even larger
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Increase amplitude for more stretch
      const smoothRotationX = Math.sin(animationValue * Math.PI * 2) * 0.35;
      const smoothRotationY = Math.cos(animationValue * Math.PI * 2 + Math.PI / 3) * 0.4;
      const smoothRotationZ = Math.sin(animationValue * Math.PI * 2 + Math.PI / 6) * 0.25;
      
      // Calculate number of points based on screen size - add even more points to create infinite effect
      const numPointsX = Math.ceil(width / baseSpacing) + 15; // Increased from +10
      const numPointsY = Math.ceil(height / baseSpacing) + 15; // Increased from +10
      
      // Create points array with smooth animation offset
      const points: { x: number; y: number; z: number }[] = [];
      
      // Increase the range to extend beyond viewport boundaries
      for (let y = -5; y <= numPointsY; y++) { // Changed from -3 to -5
        for (let x = -5; x <= numPointsX; x++) { // Changed from -3 to -5
          // Use sine waves for smooth looping movement with varied frequencies
          const waveFreqX = 0.15 + Math.sin(animationValue) * 0.08;
          const waveFreqY = 0.15 + Math.cos(animationValue) * 0.08;
          
          const offsetX = Math.sin(animationValue * Math.PI * 2 + x * waveFreqX) * 35; // Increased from 25
          const offsetY = Math.sin(animationValue * Math.PI * 2 + y * waveFreqY + Math.PI / 4) * 35; // Increased from 25
          
          const animatedX = x * baseSpacing + offsetX;
          const animatedY = y * baseSpacing + offsetY;
          
          // Apply 3D rotation with dynamic values for more lifelike movement
          const rotationX = 0.7 + smoothRotationX;
          const rotationY = 0.7 + smoothRotationY;
          const rotationZ = 0.3 + smoothRotationZ;
          
          // 3D transformation
          const point = transformPoint(
            animatedX, 
            animatedY, 
            0,
            centerX, 
            centerY, 
            rotationX, 
            rotationY, 
            rotationZ
          );
          
          // Expand the visible area check to include more off-screen points
          if (point.x >= -1500 && point.x <= width + 1500 && 
              point.y >= -1500 && point.y <= height + 1500) { // Increased from -1000/+1000 to -1500/+1500
            points.push(point);
          }
        }
      }
      
      // Draw connections between points with improved aesthetics
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect points that are close enough, with dynamic threshold - increased connection range
          const connectionThreshold = baseSpacing * (1.7 + Math.sin(animationValue) * 0.3); // Increased from 1.7 and 0.3
          
          if (distance < connectionThreshold) {
            const zCoord = (points[i].z + points[j].z) / 2; // Average z-coordinate for depth
            const parallaxFactor = calculateParallaxFactor(zCoord);
            
            // Ensure line width is positive and proportional to z-depth - increased thickness
            ctx.lineWidth = Math.max(0.2, 1.2 * parallaxFactor); // Increased from 0.1 and 0.8
            
            // Calculate alpha based on distance and z-coordinate for depth effect - reduced opacity
            const alpha = Math.min(0.6, (1 - distance / connectionThreshold) * 0.5 * parallaxFactor); // Reduced from 0.9 and 0.8
            
            // Pulse effect on lines with more pronounced pulse
            const pulseEffect = 0.7 + Math.sin(animationValue * 6 + distance * 0.01) * 0.4; // Increased from 5 and 0.3
            ctx.strokeStyle = `rgba(${rgbColor}, ${alpha * pulseEffect})`;
            
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw dots with improved aesthetics - larger, more visible dots
      for (const point of points) {
        const parallaxFactor = calculateParallaxFactor(point.z);
        
        // Ensure radius is positive and varies slightly with animation - increased base size
        const pulse = 1 + Math.sin(animationValue * 3 + point.x * 0.01 + point.y * 0.01) * 0.3; // Increased from 0.2
        const radius = Math.max(1.2, 3 * parallaxFactor * pulse); // Increased from 0.5 and 2
        
        // Add glow effect
        // First draw a larger, softer circle for the glow
        const glowRadius = radius * 2.5;
        const glowAlpha = 0.3 * parallaxFactor;
        ctx.fillStyle = `rgba(${rgbColor}, ${glowAlpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Dot color with dynamic glow effect - reduced opacity
        const dotAlpha = Math.min(0.8, 0.6 + Math.sin(animationValue * 2) * 0.1); // Reduced from 1 and 0.9
        ctx.fillStyle = `rgba(${rgbColor}, ${dotAlpha * parallaxFactor})`;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update animation with significantly reduced speed
      animationValue += 0.0005; // Decreased from 0.003 to make animation much slower
      if (animationValue > 1) animationValue = 0;
      
      animationRef.current = requestAnimationFrame(drawNetworkPattern);
    };
    
    // Helper functions
    function transformPoint(
      x: number, 
      y: number, 
      z: number,
      centerX: number, 
      centerY: number, 
      rotationX: number, 
      rotationY: number, 
      rotationZ: number
    ) {
      // Translate to origin
      x = x - centerX;
      y = y - centerY;
      
      // Apply rotations (3D transformation)
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);
      
      // Rotate around X axis
      let newY = y * cosX - z * sinX;
      let newZ = y * sinX + z * cosX;
      y = newY;
      z = newZ;
      
      // Rotate around Y axis
      let newX = x * cosY + z * sinY;
      newZ = -x * sinY + z * cosY;
      x = newX;
      z = newZ;
      
      // Rotate around Z axis
      newX = x * cosZ - y * sinZ;
      newY = x * sinZ + y * cosZ;
      x = newX;
      y = newY;
      
      // Translate back
      return { 
        x: x + centerX, 
        y: y + centerY,
        z 
      };
    }
    
    function calculateParallaxFactor(z: number) {
      const maxZ = 1000;
      const minZ = -1000;
      const minScale = 0.4; // Increased from 0.3
      const maxScale = 1.8; // Increased from 1.5
      
      // Normalize z and clamp between 0 and 1 to prevent negative values
      const normalizedZ = Math.max(0, Math.min(1, (z - minZ) / (maxZ - minZ)));
      return minScale + (maxScale - minScale) * (1 - normalizedZ);
    }
    
    function hexToRgb(hex: string) {
      // Remove # if present
      hex = hex.replace(/^#/, '');
      
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      
      // Parse hex to RGB
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      
      return `${r}, ${g}, ${b}`;
    }
    
    // Start animation
    drawNetworkPattern();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDarkMode]);
  
  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${
          isDarkMode 
            ? `${theme.colors.dark.gradientStart}, ${theme.colors.dark.gradientEnd}`
            : `${theme.colors.light.gradientStart}, ${theme.colors.light.gradientEnd}`
        })`
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          opacity: 0.2, // Reduced from 0.85 for less opacity
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0))'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground; 