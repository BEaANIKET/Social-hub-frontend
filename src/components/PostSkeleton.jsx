import React from 'react';

export const PostSkeleton = () => {
    return (
        <div className="max-w-md sm:w-[450px] w-full mx-auto bg-[#FFFF] rounded-lg shadow-md overflow-hidden my-4">
            <div className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
            </div>
            <div className="h-64 bg-gray-200"></div>
            <div className="p-4">     
                <div className="mt-4 flex items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="ml-2 h-6 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};
