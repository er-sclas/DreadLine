
'use client';

import type { Task } from '@/lib/types';
import { isBefore, formatDistanceToNow } from 'date-fns';
import { CalendarDays, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteTask } from '@/lib/actions';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const isOverdue = isBefore(deadline, now);
  const isDueSoon = !isOverdue && isBefore(deadline, new Date(now.getTime() + 24 * 60 * 60 * 1000));

  const timeText = formatDistanceToNow(deadline, { addSuffix: true });

  return (
    <Card className={cn(
        "transition-all",
        isOverdue && "border-destructive/50 shadow-lg shadow-destructive/10",
        isDueSoon && "border-accent/50 shadow-lg shadow-accent/10"
    )}>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <p className="font-medium text-card-foreground">{task.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{timeText}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOverdue && <Badge variant="destructive" className="animate-pulse">Overdue</Badge>}
          {isDueSoon && <Badge className="bg-accent text-accent-foreground hover:bg-accent/80 animate-pulse">Due Soon</Badge>}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete task</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Giving up already? How predictable.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteTask}>
                    <input type="hidden" name="id" value={task.id} />
                    <AlertDialogAction type="submit">Delete</AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
