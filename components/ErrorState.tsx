import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-16 px-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
      <h3 className="text-xl font-semibold">Oops! Something went wrong.</h3>
      <p className="mt-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
