import type { Task } from './types';
import { add, isAfter, isBefore, sub, parse, set, startOfTomorrow, endOfDay, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for tasks
// Using a global to persist data across hot reloads in development
declare global {
  var tasks: Task[] | undefined;
}

const initialTasks: Task[] = [
  { id: '1', description: 'Let your plants die', deadline: sub(new Date(), { days: 2 }).toISOString(), completed: false },
  { id: '2', description: 'Forget to call mom', deadline: add(new Date(), { hours: 3 }).toISOString(), completed: false },
  { id: '3', description: 'Procrastinate on project', deadline: add(new Date(), { days: 5 }).toISOString(), completed: false },
  { id: '4', description: 'Submit French essay', deadline: sub(new Date(), { days: 2, hours: 5}).toISOString(), completed: false },
];

if (process.env.NODE_ENV === 'production') {
  global.tasks = initialTasks;
} else {
  if (!global.tasks) {
    global.tasks = initialTasks;
  }
}

let tasks: Task[] = global.tasks!;

export const findTasks = async (status?: 'overdue' | 'due_soon' | 'all'): Promise<Task[]> => {
  const now = new Date();
  let filteredTasks: Task[];

  if (status === 'overdue') {
    filteredTasks = tasks.filter(task => !task.completed && isBefore(new Date(task.deadline), now));
  } else if (status === 'due_soon') {
    const soon = add(now, { hours: 24 });
    filteredTasks = tasks.filter(task => !task.completed && isAfter(new Date(task.deadline), now) && isBefore(new Date(task.deadline), soon));
  } else {
    filteredTasks = tasks.filter(t => !t.completed);
  }
  
  return filteredTasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};

export const createTask = async (description: string, deadline: string): Promise<Task> => {
  const newTask: Task = {
    id: uuidv4(),
    description,
    deadline,
    completed: false,
  };
  tasks.push(newTask);
  return newTask;
};

export const removeTask = async (id: string): Promise<void> => {
  tasks = tasks.filter(task => task.id !== id);
  global.tasks = tasks;
};

// Simple NLP date parser
export const parseDateFromNLP = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  const now = new Date();

  // "tomorrow at 5pm"
  const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    if (timeMatch[3] === 'pm' && hours < 12) hours += 12;
    if (timeMatch[3] === 'am' && hours === 12) hours = 0;
  }

  let date = new Date();

  if (lowerText.includes('tomorrow')) {
    date = startOfTomorrow();
  } else if (lowerText.includes('in 2 days')) {
    date = addDays(date, 2);
  } else if (lowerText.includes('next week')) {
    date = addDays(date, 7);
  } else if (lowerText.includes('tonight')) {
     date = endOfDay(now);
  }

  if (timeMatch) {
    return set(date, { hours, minutes, seconds: 0 }).toISOString();
  } else if (date.getTime() !== now.getTime()) {
     return endOfDay(date).toISOString();
  }

  // Try to parse more complex dates like 'Nov 6 5pm'
  try {
    const parsedDate = parse(text, 'MMM d p', new Date());
    if(!isNaN(parsedDate.getTime())) return parsedDate.toISOString();

    const parsedDate2 = parse(text, 'MMM d', new Date());
     if(!isNaN(parsedDate2.getTime())) return endOfDay(parsedDate2).toISOString();

  } catch (e) {
    // ignore
  }

  return null;
};
