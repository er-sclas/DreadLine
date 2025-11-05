
'use server';

import { revalidatePath } from 'next/cache';
import {
  createTask,
  findTasks,
  removeTask,
  parseDateFromNLP,
} from '@/lib/db';

export async function getTasks(status?: 'overdue' | 'due_soon' | 'all') {
  return await findTasks(status);
}

export async function addTask(description: string, deadline: string) {
  const isoDeadline = parseDateFromNLP(deadline);
  if (!isoDeadline) {
    throw new Error("Couldn't understand that deadline. Try something like 'tomorrow at 5pm' or 'in 3 days'.");
  }
  await createTask(description, isoDeadline);
  revalidatePath('/');
}

export async function deleteTask(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await removeTask(id);
    revalidatePath('/');
  }
}
