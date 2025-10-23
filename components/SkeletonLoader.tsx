import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="mt-6 animate-pulse">
      <div className="text-center mb-10">
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="h-6 w-1/3 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="h-6 w-1/4 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
