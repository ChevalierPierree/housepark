import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]';

    const variants = {
      primary:
        'bg-primary text-gray-900 hover:bg-primary-dark shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40',
      secondary:
        'bg-secondary text-white hover:bg-secondary-dark shadow-md shadow-secondary/20',
      outline:
        'border-2 border-gray-200 text-dark hover:border-gray-300 hover:bg-gray-50',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-dark',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;
