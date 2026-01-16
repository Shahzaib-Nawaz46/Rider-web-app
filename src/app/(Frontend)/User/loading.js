import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#95CB33] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#1A1A1A] font-semibold text-lg">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
