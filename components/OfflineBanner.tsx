import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOffIcon } from './IconComponents';

const OfflineBanner: React.FC = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) {
        return null;
    }

    return (
        <div className="bg-yellow-500 text-white text-center p-2 flex items-center justify-center gap-2">
            <WifiOffIcon className="w-5 h-5" />
            <span>You are currently offline. Some features may be unavailable.</span>
        </div>
    );
};

export default OfflineBanner;
