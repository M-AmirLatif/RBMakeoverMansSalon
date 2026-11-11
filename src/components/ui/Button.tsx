import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "gold",
  size = "md",
  href,
  external = false,
  icon,
  iconPosition = "right",
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center text-center leading-none font-medium rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F0D] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none";

  const sizeStyles = {
    sm: "text-xs tracking-wider uppercase px-4 py-2 min-h-[40px] gap-2 font-semibold",
    md: "text-sm tracking-wide px-6 py-3 min-h-[48px] gap-2.5 font-semibold",
    lg: "text-base tracking-wide px-8 py-4 min-h-[54px] gap-3 font-semibold",
  }[size];

  const variantStyles = {
    gold: "bg-[#C59B46] text-[#0B0F0D] hover:bg-[#DFC074] shadow-[0_4px_20px_rgba(197,155,70,0.25)] hover:shadow-[0_6px_25px_rgba(197,155,70,0.35)]",
    outline:
      "border border-[#C59B46]/70 text-[#F5EFEB] hover:text-[#0B0F0D] hover:bg-[#C59B46] hover:border-[#C59B46] shadow-sm backdrop-blur-sm",
    secondary:
      "bg-[#1A231E] text-[#F5EFEB] border border-white/10 hover:border-[#C59B46]/50 hover:bg-[#232F28]",
    ghost:
      "bg-transparent text-[#BBB4A6] hover:text-[#F5EFEB] hover:bg-white/5",
  }[variant];

  const widthStyle = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="inline-flex items-center justify-center shrink-0 leading-none">
          {icon}
        </span>
      )}
      <span className="inline-flex items-center justify-center leading-none text-center">
        {children}
      </span>
      {icon && iconPosition === "right" && (
        <span className="inline-flex items-center justify-center shrink-0 leading-none">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
}
