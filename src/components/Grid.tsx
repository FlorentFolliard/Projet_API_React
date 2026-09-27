import React from 'react';

type GridProps = {
  children: React.ReactNode;
  columns?: number;
};

export const Grid: React.FC<GridProps> = ({ children }) => {
  return <div className="custom-grid">{children}</div>;
};