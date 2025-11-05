export interface Task {
  id: string;
  description: string;
  deadline: string; // ISO string
  completed: boolean;
}

export interface Message {
  id: string;
  text: React.ReactNode;
  sender: 'user' | 'bot';
}
