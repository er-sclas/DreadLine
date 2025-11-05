import { getTasks } from '@/lib/actions';
import { DreadlineApp } from '@/components/dreadline-app';

export default async function Home() {
  const allTasks = await getTasks('all');
  const overdueTasks = await getTasks('overdue');
  const dueSoonTasks = await getTasks('due_soon');

  return (
    <DreadlineApp
      initialTasks={allTasks}
      overdueTasks={overdueTasks}
      dueSoonTasks={dueSoonTasks}
    />
  );
}
