import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, FileText, Paperclip, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPTED_FILE_TYPES, readFileData } from '@/lib/files';
import { cn, formatBytes } from '@/lib/utils';
import type { PendingFile } from '@/types/chat';

interface ChatComposerProps {
  isLoading: boolean;
  allowFiles: boolean;
  placeholder: string;
  /** Text injected from outside (e.g. an "Analyze" button); `nonce` makes repeated values re-apply. */
  draft?: { text: string; nonce: number };
  onSend: (text: string, file?: PendingFile) => void;
  onStop: () => void;
}

export function ChatComposer({ isLoading, allowFiles, placeholder, draft, onSend, onStop }: ChatComposerProps) {
  const [text, setText] = useState('');
  const [pending, setPending] = useState<PendingFile>();
  const [fileError, setFileError] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft) return;
    setText(draft.text);
    textareaRef.current?.focus();
  }, [draft]);

  // Auto-grow the textarea up to a max height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [text]);

  useEffect(() => {
    if (!allowFiles) setPending(undefined);
  }, [allowFiles]);

  const attach = async (file: File | undefined) => {
    if (!file) return;
    setFileError(undefined);
    try {
      setPending({ file, data: await readFileData(file) });
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'Could not read file');
    }
  };

  const canSend = !isLoading && (text.trim().length > 0 || !!pending);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    onSend(text, pending);
    setText('');
    setPending(undefined);
    setFileError(undefined);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      onDragOver={(e) => {
        if (!allowFiles) return;
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        if (!allowFiles) return;
        e.preventDefault();
        setIsDragging(false);
        void attach(e.dataTransfer.files[0]);
      }}
      className={cn(
        'rounded-xl border bg-background p-2 transition-colors focus-within:border-ring/60',
        isDragging && 'border-primary bg-primary/5',
      )}
    >
      {(pending || fileError) && (
        <div className="mb-2 flex items-center gap-2 px-1">
          {pending && (
            <div className="flex min-w-0 items-center gap-2 rounded-md bg-muted px-2 py-1 text-xs">
              <FileText className="size-3.5 shrink-0 text-primary" />
              <span className="truncate font-medium">{pending.file.name}</span>
              <span className="shrink-0 text-muted-foreground">{formatBytes(pending.file.size)}</span>
              <button
                type="button"
                onClick={() => setPending(undefined)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Remove attachment"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
          {fileError && <span className="text-xs text-destructive">{fileError}</span>}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={placeholder}
        aria-label="Message"
        className="block max-h-[180px] w-full resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none"
      />

      <div className="mt-1 flex items-center justify-between">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            className="hidden"
            onChange={(e) => {
              void attach(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!allowFiles || isLoading}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            title={allowFiles ? 'Attach CSV, PDF, JSON, text or image' : 'Attachments need the Claude provider'}
          >
            <Paperclip />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-muted-foreground sm:inline">Shift + Enter for a new line</span>
          {isLoading ? (
            <Button size="icon-sm" variant="secondary" onClick={onStop} aria-label="Stop generating" title="Stop">
              <Square className="fill-current" />
            </Button>
          ) : (
            <Button type="submit" size="icon-sm" disabled={!canSend} aria-label="Send message">
              <ArrowUp />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
