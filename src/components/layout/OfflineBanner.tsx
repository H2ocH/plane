import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOffIcon } from '@/components/IconComponents';

const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 text-sm text-center p-2 flex items-center justify-center">
      <WifiOffIcon className="h-4 w-4 mr-2" />
      You are currently offline. Some features may be unavailable.
    </div>
  );
};

export default OfflineBanner;
