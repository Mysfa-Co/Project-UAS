import React from 'react';

interface PixelCardProps {
  imageSrc: string;
  title?: string;
  children?: React.ReactNode;
}

const PixelCard: React.FC<PixelCardProps> = ({ imageSrc, title, children }) => {
  return (
    <div className="bg-white p-2 border-4 border-black shadow-hard max-w-md mx-auto w-full">
      <div className="border-2 border-black mb-2 overflow-hidden bg-retro-dark aspect-square relative group">
        <img 
          src={imageSrc} 
          alt={title || "Pixel Art"} 
          className="w-full h-full object-cover rendering-pixelated"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      {title && (
        <h3 className="font-pixel text-retro-dark text-xs mb-2 truncate">{title}</h3>
      )}
      <div className="font-retro text-retro-dark text-lg leading-tight">
        {children}
      </div>
    </div>
  );
};

export default PixelCard;