import React from 'react';

const FullScreenLoader = ({ isLoading, message = 'Loading...' }) => {
    if (!isLoading) return null; // Don't render if not loading

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white">
            <div className="text-center">
                <div className="loader animate-spin rounded-full border-4 border-t-4 border-gray-400 border-t-blue-500 w-16 h-16 mb-4"></div>
                <p className="text-lg font-semibold">{message}</p>
            </div>
        </div>
    );
};

export default FullScreenLoader;
