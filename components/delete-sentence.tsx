"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecallData } from "@/components/data-provider";

export function DeleteSentence({ id }: { id: string }) {
  const { deleteSentence } = useRecallData();
  return <AlertDialog.Root><AlertDialog.Trigger asChild><Button variant="ghost" size="icon" aria-label="문장 삭제"><Trash2 className="size-4"/></Button></AlertDialog.Trigger><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/75"/><AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6"><AlertDialog.Title className="text-lg font-semibold">Delete this sentence?</AlertDialog.Title><AlertDialog.Description className="mt-2 text-sm leading-6 text-zinc-400">문장과 연결된 모든 복습 기록이 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</AlertDialog.Description><div className="mt-6 flex justify-end gap-2"><AlertDialog.Cancel asChild><Button variant="ghost">Cancel</Button></AlertDialog.Cancel><AlertDialog.Action asChild><Button variant="destructive" onClick={() => void deleteSentence(id)}>Delete</Button></AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root>;
}
