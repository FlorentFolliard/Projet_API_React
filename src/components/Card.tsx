import React from 'react';

type CardProps = {
  title?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, onClick, className = '', children }) => {
  return (
    <div
      className={`custom-card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
};