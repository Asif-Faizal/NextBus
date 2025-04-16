'use client';

import React, { useEffect, useRef, useState } from 'react';
import { theme } from '@/theme/theme';

interface GradientBackgroundProps {
    children: React.ReactNode;
    isDarkMode?: boolean;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    isDarkMode = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset before scaling
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let animationValue = 0;

        const drawNetworkPattern = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            ctx.clearRect(0, 0, width, height);

            const baseColor = isDarkMode
                ? theme.colors.dark.primary
                : theme.colors.light.primary;

            const rgbColor = hexToRgb(baseColor);

            ctx.lineWidth = 1.2;

            const baseSpacing = Math.min(width, height) / 3;
            const centerX = width / 2;
            const centerY = height / 2;

            const smoothRotationX = Math.sin(animationValue * Math.PI * 2) * 0.35;
            const smoothRotationY = Math.cos(animationValue * Math.PI * 2 + Math.PI / 3) * 0.4;
            const smoothRotationZ = Math.sin(animationValue * Math.PI * 2 + Math.PI / 6) * 0.25;

            const numPointsX = Math.ceil(width / baseSpacing) + 15;
            const numPointsY = Math.ceil(height / baseSpacing) + 15;

            const points: { x: number; y: number; z: number }[] = [];

            for (let y = -5; y <= numPointsY; y++) {
                for (let x = -5; x <= numPointsX; x++) {
                    const waveFreqX = 0.15 + Math.sin(animationValue) * 0.08;
                    const waveFreqY = 0.15 + Math.cos(animationValue) * 0.08;

                    const offsetX = Math.sin(animationValue * Math.PI * 2 + x * waveFreqX) * 35;
                    const offsetY = Math.sin(animationValue * Math.PI * 2 + y * waveFreqY + Math.PI / 4) * 35;

                    const animatedX = x * baseSpacing + offsetX;
                    const animatedY = y * baseSpacing + offsetY;

                    const point = transformPoint(
                        animatedX,
                        animatedY,
                        0,
                        centerX,
                        centerY,
                        0.7 + smoothRotationX,
                        0.7 + smoothRotationY,
                        0.3 + smoothRotationZ
                    );

                    if (
                        point.x >= -1500 &&
                        point.x <= width + 1500 &&
                        point.y >= -1500 &&
                        point.y <= height + 1500
                    ) {
                        points.push(point);
                    }
                }
            }

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const connectionThreshold =
                        baseSpacing * (1.7 + Math.sin(animationValue) * 0.3);

                    if (distance < connectionThreshold) {
                        const zCoord = (points[i].z + points[j].z) / 2;
                        const parallaxFactor = calculateParallaxFactor(zCoord);

                        ctx.lineWidth = Math.max(0.2, 1.2 * parallaxFactor);

                        const alpha =
                            Math.min(0.3, (1 - distance / connectionThreshold) * 0.25 * parallaxFactor); // was 0.6 & 0.5


                        const pulseEffect =
                            0.7 + Math.sin(animationValue * 6 + distance * 0.01) * 0.4;

                        ctx.strokeStyle = `rgba(${rgbColor}, ${alpha * pulseEffect})`;

                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (const point of points) {
                const parallaxFactor = calculateParallaxFactor(point.z);

                const pulse =
                    1 + Math.sin(animationValue * 3 + point.x * 0.01 + point.y * 0.01) * 0.3;
                const radius = Math.max(1.2, 3 * parallaxFactor * pulse);

                const glowRadius = radius * 2.5;
                const glowAlpha = 0.15 * parallaxFactor;
                ctx.fillStyle = `rgba(${rgbColor}, ${glowAlpha})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
                ctx.fill();

                const dotAlpha = Math.min(0.6, 0.4 + Math.sin(animationValue * 2) * 0.1); // was 0.8 & 0.6
                ctx.fillStyle = `rgba(${rgbColor}, ${dotAlpha * parallaxFactor})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            animationValue += 0.0002; // slower animation

            if (animationValue > 1) animationValue = 0;

            animationRef.current = requestAnimationFrame(drawNetworkPattern);
        };

        animationRef.current = requestAnimationFrame(drawNetworkPattern);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isMounted, isDarkMode]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    pointerEvents: 'none',
                }}
            />
            {children}
        </div>
    );
};

// Utilities
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
    x -= centerX;
    y -= centerY;

    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);

    let newY = y * cosX - z * sinX;
    let newZ = y * sinX + z * cosX;
    y = newY;
    z = newZ;

    let newX = x * cosY + z * sinY;
    newZ = -x * sinY + z * cosY;
    x = newX;
    z = newZ;

    newX = x * cosZ - y * sinZ;
    newY = x * sinZ + y * cosZ;
    x = newX;
    y = newY;

    return { x: x + centerX, y: y + centerY, z };
}

function calculateParallaxFactor(z: number) {
    const maxZ = 1000;
    const minZ = -1000;
    const minScale = 0.4;
    const maxScale = 1.8;
    const clampedZ = Math.max(minZ, Math.min(maxZ, z));
    const normalized = (clampedZ - minZ) / (maxZ - minZ);
    return minScale + normalized * (maxScale - minScale);
}

function hexToRgb(hex: string): string {
    const parsedHex = hex.replace(/^#/, '');
    const bigint = parseInt(parsedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

export default GradientBackground;
