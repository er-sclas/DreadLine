
'use client';

import type { Task, Message } from '@/lib/types';
import { useState, useEffect, useTransition } from 'react';
import { differenceInDays, formatDistanceToNow, isBefore } from 'date-fns';
import { addTask, deleteTask } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { TaskList } from '@/components/task-list';
import { ChatPanel } from '@/components/chat-panel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Bot, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface DreadlineAppProps {
  initialTasks: Task[];
  overdueTasks: Task[];
  dueSoonTasks: Task[];
}

export function DreadlineApp({ initialTasks, overdueTasks, dueSoonTasks }: DreadlineAppProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pendingTaskDescription, setPendingTaskDescription] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const botAvatar = PlaceHolderImages.find(p => p.id === 'bot-avatar');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    let initialMessageText = '';
    if (overdueTasks.length > 0) {
      const oldestOverdue = overdueTasks[0];
      const daysOverdue = Math.abs(differenceInDays(new Date(), new Date(oldestOverdue.deadline)));
      initialMessageText = `Before we even start with your new excuses, what about that "${oldestOverdue.description}" task that's been overdue for ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}? Did you think I'd forget? Pathetic.`;
    } else if (dueSoonTasks.length > 0) {
      const soonestTask = dueSoonTasks[0];
      initialMessageText = `You have no overdue tasks. A miracle. However, your "${soonestTask.description}" task is due soon. I'm just letting you know so I can be ready to mock you when you miss it.`;
    } else {
      initialMessageText = 'Fine. A clean slate. What are you planning to procrastinate on today?';
    }
    setMessages([{ id: `init-${Date.now()}`, sender: 'bot', text: initialMessageText }]);
  }, [overdueTasks, dueSoonTasks]);

  const addBotMessage = (text: string, delay = 1000) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, sender: 'bot', text }]);
      setIsSending(false);
    }, delay);
  };

  const handleSendMessage = async (messageText: string) => {
    setIsSending(true);
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: messageText }]);

    if (pendingTaskDescription) {
      // We are waiting for a deadline
      try {
        await addTask(pendingTaskDescription, messageText);
        addBotMessage(`Fine. Added "${pendingTaskDescription}". I'll be here to remind you when you forget.`);
        setPendingTaskDescription(null);
      } catch (error) {
        addBotMessage((error as Error).message);
      }
    } else {
      // This is a new message, potentially a new task
      const deadlineMatch = messageText.match(/(by|at|on|in)\s(.+)/i);
      if (deadlineMatch) {
        const description = messageText.substring(0, deadlineMatch.index).trim();
        const deadline = deadlineMatch[0];
        try {
          await addTask(description, deadline);
          addBotMessage(`Fine. Added "${description}". I'll be here to remind you when you forget.`);
        } catch (error) {
          addBotMessage((error as Error).message);
        }
      } else {
        // No deadline found, ask for one
        setPendingTaskDescription(messageText);
        addBotMessage(`Vague. "${messageText}" is not a plan. When do you pretend you'll have this done? Give me a deadline.`);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="p-4 border-b flex items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Logo />
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        <TaskList tasks={tasks} />

        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && (
                <Avatar className="h-8 w-8 border-2 border-primary">
                  {botAvatar ? <AvatarImage src={botAvatar.imageUrl} alt="Bot Avatar" data-ai-hint={botAvatar.imageHint} /> : <Bot />}
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <Avatar className="h-8 w-8 border-2 border-secondary">
                  <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isSending && (
             <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8 border-2 border-primary">
                  {botAvatar ? <AvatarImage src={botAvatar.imageUrl} alt="Bot Avatar" data-ai-hint={botAvatar.imageHint} /> : <Bot />}
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div className="max-w-md p-3 rounded-lg bg-card text-card-foreground">
                    <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 border-t sticky bottom-0 bg-background">
        <ChatPanel
          input={input}
          setInput={setInput}
          isSending={isSending}
          onSendMessage={handleSendMessage}
        />
      </footer>
    </div>
  );
}
