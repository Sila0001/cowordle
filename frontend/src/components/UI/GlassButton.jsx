import React from 'react';

function GlassButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  type = 'button',
  className = '' 
}) {
  const baseClasses = 'glass-btn';
  const variantClasses = {
    primary: 'glass-btn-primary',
    secondary: 'glass-btn-secondary', 
    outline: 'glass-btn-outline',
    small: 'glass-btn-small'
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    disabled ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default GlassButton;