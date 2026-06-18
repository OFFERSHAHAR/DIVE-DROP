import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = true, className, ...props }, ref) => {
    const variantClasses = {
      'default': 'bg-bg-primary border border-border-primary shadow-elevation-1 dark:bg-dark-surface dark:border-border-dark',
      'elevated': 'bg-bg-primary shadow-elevation-2 hover:shadow-elevation-3 dark:bg-dark-surface',
      'outlined': 'bg-transparent border-2 border-border-primary dark:border-border-dark',
    }[variant];

    const hoverClass = hover && variant !== 'outlined' ? 'hover:shadow-elevation-3 hover:translate-y-[-2px]' : '';

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg transition-all duration-base',
          variantClasses,
          hoverClass,
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'px-4 sm:px-6 py-4 border-b border-border-primary dark:border-border-dark',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'px-4 sm:px-6 py-4',
        className
      )}
      {...props}
    />
  )
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'px-4 sm:px-6 py-4 border-t border-border-primary bg-bg-secondary rounded-b-lg dark:bg-dark-surface-elevated dark:border-border-dark',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
