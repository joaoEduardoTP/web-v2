import React from 'react';

interface PageSkeletonProps {
  count?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="animate-pulse">
      { Array.from({ length: count }).map((_, index) => (
        <div key={ index } className="mb-4">
          <div className="h-4 bg-background rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-background rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-background rounded w-2/3"></div>
          <div className="mt-4 h-32 bg-background rounded"></div>
        </div>
      )) }
    </div>
  );
};

export default PageSkeleton;

