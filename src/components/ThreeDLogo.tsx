import React from 'react';

interface ThreeDLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ThreeDLogo({ className = '', size = 'md' }: ThreeDLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48'
  };

  const scaleFactor = {
    sm: 'scale3d(0.25, 0.25, 0.25)',
    md: 'scale3d(0.45, 0.45, 0.45)',
    lg: 'scale3d(0.85, 0.85, 0.85)',
    xl: 'scale3d(1.7, 1.7, 1.7)'
  }[size];

  return (
    <div 
      className={`relative flex items-center justify-center select-none shrink-0 ${sizeClasses[size]} ${className}`} 
      style={{ perspective: '1000px' }}
    >
      {/* 3D Scene container */}
      <div 
        className="w-full h-full relative flex items-center justify-center" 
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'logo-float 4s ease-in-out infinite'
        }}
      >
        {/* Outer Gyro Ring 1 (Y-axis rotation) */}
        <div 
          className="absolute inset-0 border border-cyan-400/80 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'logo-rotate-y 12s linear infinite',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.15), inset 0 0 15px rgba(34, 211, 238, 0.15)'
          }}
        />

        {/* Outer Gyro Ring 2 (X-axis rotation) */}
        <div 
          className="absolute inset-0 border border-dashed border-blue-500/70 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'logo-rotate-x 8s linear infinite',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.15), inset 0 0 10px rgba(59, 130, 246, 0.15)'
          }}
        />

        {/* Outer Gyro Ring 3 (Z-axis rotation) */}
        <div 
          className="absolute inset-0 border border-indigo-500/40 rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'logo-rotate-z 16s linear infinite',
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.1), inset 0 0 8px rgba(99, 102, 241, 0.1)'
          }}
        />

        {/* Inner Glowing Core - A 3D Rotating Cube */}
        <div 
          className="absolute w-8 h-8 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'logo-rotate-cube 6s linear infinite',
            transform: scaleFactor
          }}
        >
          {/* Cube Faces (32px offset for Z is half of 64px width, but here container is 8h-8w. Let's make face width 32px (w-8 h-8) so translation is translateZ(16px)) */}
          {/* Front */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-cyan-400/90 to-blue-500/90 border border-cyan-300 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            style={{ transform: 'translateZ(16px)' }} 
          />
          {/* Back */}
          <div 
            className="absolute inset-0 bg-gradient-to-bl from-cyan-500/90 to-blue-600/90 border border-cyan-400 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            style={{ transform: 'rotateY(180deg) translateZ(16px)' }} 
          />
          {/* Left */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-400/90 to-purple-500/90 border border-indigo-300 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            style={{ transform: 'rotateY(-90deg) translateZ(16px)' }} 
          />
          {/* Right */}
          <div 
            className="absolute inset-0 bg-gradient-to-tl from-indigo-500/90 to-purple-600/90 border border-indigo-400 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            style={{ transform: 'rotateY(90deg) translateZ(16px)' }} 
          />
          {/* Top */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-blue-300/90 to-indigo-400/90 border border-blue-200 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            style={{ transform: 'rotateX(90deg) translateZ(16px)' }} 
          />
          {/* Bottom */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-700/90 border border-blue-500 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            style={{ transform: 'rotateX(-90deg) translateZ(16px)' }} 
          />
        </div>

        {/* Orbiting particles */}
        <div 
          className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee] opacity-90" 
          style={{ 
            transform: 'rotateY(45deg) translateZ(32px)'
          }} 
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] opacity-80" 
          style={{ 
            transform: 'rotateX(60deg) translateZ(-36px)'
          }} 
        />
      </div>
    </div>
  );
}
