"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ children, title }: { children: React.ReactNode; title: string }) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 data-[state=open]:animate-in"/><DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl outline-none"><div className="mb-6 flex items-center justify-between"><DialogPrimitive.Title className="text-xl font-semibold tracking-tight">{title}</DialogPrimitive.Title><DialogPrimitive.Close className="rounded-full p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white" aria-label="닫기"><X className="size-4"/></DialogPrimitive.Close></div>{children}</DialogPrimitive.Content></DialogPrimitive.Portal>;
}
export const DialogClose = DialogPrimitive.Close;
