import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[.98]", {
  variants: { variant: { default: "bg-white text-black hover:bg-zinc-200", secondary: "bg-zinc-800 text-white hover:bg-zinc-700", ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-white", destructive: "bg-red-500 text-white hover:bg-red-400" }, size: { default: "h-11 px-5", sm: "h-9 px-4 text-xs", icon: "size-10 p-0" } }, defaultVariants: { variant: "default", size: "default" }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) { return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />; }
