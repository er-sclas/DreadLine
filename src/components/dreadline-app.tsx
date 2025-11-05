
'use client';

import type { Task, Message } from '@/lib/types';
import { useState, useEffect, useTransition } from 'react';
import { addTask, deleteTask } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { TaskList } from '@/components/task-list';
import { ChatPanel } from '@/components/chat-panel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generateBotResponse } from '@/ai/flows/generate-bot-response';
import type { GenerateBotResponseOutput } from '@/ai/flows/generate-bot-response';


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
  const { toast } = useToast();
  
  const botAvatar = PlaceHolderImages.find(p => p.id === 'bot-avatar');

  useEffect(() => {
    const getInitialMessage = async () => {
        setIsSending(true);
        try {
            const res = await generateBotResponse({
                overdueTasks,
                dueSoonTasks,
                allTasksCount: initialTasks.length,
                history: [],
            });
            addBotMessage(res.response, 0);
        } catch (e) {
            console.error(e);
            addBotMessage("Fine. A clean slate. What are you planning to procrastinate on today?", 0);
        } finally {
            setIsSending(false);
        }
    }
    getInitialMessage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBotMessage = (text: string, delay = 500) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, sender: 'bot', text }]);
      setIsSending(false);
    }, delay);
  };

  const handleSendMessage = async (messageText: string) => {
    setIsSending(true);
    const newMessages: Message[] = [...messages, { id: `user-${Date.now()}`, sender: 'user', text: messageText }];
    setMessages(newMessages);

    if (pendingTaskDescription) {
      try {
        await addTask(pendingTaskDescription, messageText);
        addBotMessage(`Fine. Added "${pendingTaskDescription}". I'll be here to remind you when you forget.`);
        setPendingTaskDescription(null);
      } catch (error) {
        addBotMessage((error as Error).message);
      }
    } else {
        try {
            const res = await generateBotResponse({
                overdueTasks,
                dueSoonTasks,
                allTasksCount: tasks.length,
                history: messages.map(m => ({sender: m.sender, text: m.text as string})),
                newUserMessage: messageText,
            });

            if (res.action === 'request_deadline') {
                setPendingTaskDescription(messageText);
                addBotMessage(res.response);
            } else if (res.action === 'task_added') {
                 const deadlineMatch = messageText.match(/(by|at|on|in)\\s(.+)/i);
                 let description = messageText;
                 let deadline = 'tomorrow';
                 if (deadlineMatch) {
                    description = messageText.substring(0, deadlineMatch.index).trim();
                    deadline = deadlineMatch[0];
                 }
                await addTask(description, deadline);
                addBotMessage(res.response);
            } else {
                addBotMessage(res.response);
            }

        } catch(e) {
            console.error(e);
            addBotMessage("My brain hurts. Try again later.");
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
          {messages.map((msg) => (
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
          {isSending && messages.length > 0 && (
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
