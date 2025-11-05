import { Clock } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Clock className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold tracking-tighter text-foreground">
        Dread-line
      </h1>
    </div>
  );
}
