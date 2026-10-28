"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { useRecallData } from "@/components/data-provider";
import type { Sentence, SentenceInput } from "@/lib/types";

const EMPTY: SentenceInput = { english: "", korean: "", note: "", tags: [] };

export function SentenceForm({ sentence, trigger }: { sentence?: Sentence; trigger?: React.ReactNode }) {
  const { createSentence, updateSentence } = useRecallData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [tagText, setTagText] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setForm(sentence ? { english: sentence.english, korean: sentence.korean, note: sentence.note, tags: sentence.tags } : EMPTY);
      setTagText(sentence?.tags.join(", ") ?? "");
      setMessage("");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.english.trim() || !form.korean.trim()) { setMessage("영어 문장과 한국어 해석을 입력해 주세요."); return; }
    setSaving(true);
    const input = { ...form, english: form.english.trim(), korean: form.korean.trim(), note: form.note.trim(), tags: tagText.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean) };
    try { if (sentence) await updateSentence(sentence.id, input); else await createSentence(input); setOpen(false); } catch { setMessage("저장하지 못했습니다. 잠시 후 다시 시도해 주세요."); } finally { setSaving(false); }
  };

  return <Dialog open={open} onOpenChange={changeOpen}><DialogTrigger asChild>{trigger ?? <Button><Plus className="size-4"/>Add sentence</Button>}</DialogTrigger><DialogContent title={sentence ? "Edit sentence" : "New sentence"}><form className="space-y-4" onSubmit={submit}><label className="field-label">English sentence<Input value={form.english} onChange={(e) => setForm({ ...form, english: e.target.value })} placeholder="It's such a slap in the face." autoFocus maxLength={500}/></label><label className="field-label">Korean meaning<Input value={form.korean} onChange={(e) => setForm({ ...form, korean: e.target.value })} placeholder="정말 뒤통수 맞은 기분이야." maxLength={500}/></label><label className="field-label">Note <span>Optional</span><Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="맥락이나 뉘앙스를 적어 두세요." maxLength={1000}/></label><label className="field-label">Tags <span>Comma separated</span><Input value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="conversation, idiom"/></label>{message && <p className="form-error" role="alert">{message}</p>}<div className="flex justify-end gap-2 pt-2"><DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose><Button disabled={saving}>{saving ? "Saving…" : sentence ? "Save changes" : "Save sentence"}</Button></div></form></DialogContent></Dialog>;
}
