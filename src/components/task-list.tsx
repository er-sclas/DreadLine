import type { Task } from '@/lib/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-semibold text-muted-foreground">A clean slate. Impressive.</h2>
        <p className="text-muted-foreground">For now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Your Burden List</h2>
        <div className="space-y-2">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    </div>
  );
}
