
'use client';

import type { FormEvent } from 'react';
import { Paperclip, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ChatPanelProps {
  input: string;
  setInput: (value: string) => void;
  isSending: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ input, setInput, isSending, onSendMessage }: ChatPanelProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full items-center space-x-2"
      >
        <Input
          id="message"
          placeholder="What are you planning to procrastinate on today?"
          autoComplete="off"
          className="flex-1 h-12 text-base pr-14"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9"
          disabled={isSending || !input.trim()}
          aria-label="Send message"
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
