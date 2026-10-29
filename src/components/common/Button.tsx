import React from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'green' | 'teal' | 'saffron';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ActionButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    to?: never;
    href?: never;
  };

type RouterLinkButtonProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps | 'href'> & {
    to: string;
    href?: never;
  };

type ExternalLinkButtonProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    to?: never;
    href: string;
  };

export type ButtonProps = ActionButtonProps | RouterLinkButtonProps | ExternalLinkButtonProps;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const baseStyles =
    'group inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] focus-visible:ring-offset-2 focus-visible:ring-offset-paleBlue-100 dark:focus-visible:ring-offset-darkSurface-base disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:transform-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 min-h-[38px] gap-1.5',
    md: 'text-sm px-5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#159E9A] text-white hover:bg-[#0F8380] hover:-translate-y-0.5 hover:shadow-md shadow-teal-subtle border border-[#159E9A]/30 font-semibold',
    secondary:
      'bg-[#EAF5FB] dark:bg-darkSurface-card text-[#183153] dark:text-white hover:bg-[#DDF3F0] dark:hover:bg-darkSurface-elevated hover:text-[#183153] hover:-translate-y-0.5 border border-[#CFE3F0] dark:border-darkSurface-border shadow-soft-card font-medium',
    outline:
      'border border-[#CFE3F0] dark:border-darkSurface-border text-[#183153] dark:text-slate-200 hover:bg-[#EAF6FC] dark:hover:bg-darkSurface-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-0.5 font-medium',
    green:
      'bg-[#239B70] text-white hover:bg-[#1C825E] hover:-translate-y-0.5 hover:shadow-md shadow-soft-card border border-[#239B70]/30 font-semibold',
    teal:
      'bg-[#159E9A] text-white hover:bg-[#0F8380] hover:-translate-y-0.5 hover:shadow-md shadow-teal-subtle border border-[#159E9A]/30 font-semibold',
    saffron:
      'bg-[#F3A54A] text-[#183153] hover:bg-[#D88427] hover:text-white hover:-translate-y-0.5 hover:shadow-md shadow-saffron-subtle border border-[#F3A54A]/30 font-semibold',
    ghost:
      'text-[#183153] dark:text-slate-300 hover:text-[#0F8380] dark:hover:text-white hover:bg-[#EAF6FC] dark:hover:bg-darkSurface-elevated border border-transparent hover:-translate-y-0.5',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {leftIcon && <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{rightIcon}</span>}
    </>
  );

  if ('to' in rest && rest.to) {
    const { to, ...linkProps } = rest as RouterLinkButtonProps;
    return (
      <Link to={to} className={combinedClasses} {...linkProps}>
        {content}
      </Link>
    );
  }

  if ('href' in rest && rest.href) {
    const { href, ...anchorProps } = rest as ExternalLinkButtonProps;
    return (
      <a
        href={href}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { onClick, disabled, type = 'button', ...buttonProps } = rest as ActionButtonProps;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...buttonProps}
    >
      {content}
    </button>
  );
};
