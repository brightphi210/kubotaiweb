import React from 'react';

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-2000">
      <div className="bg-neutral-800 p-3 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-5 h-5 border-3 border-[#FBC607] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;