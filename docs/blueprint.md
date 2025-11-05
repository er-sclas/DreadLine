# **App Name**: Dread-line

## Core Features:

- Task Input and Storage: Accept task descriptions and deadlines from the user and store them. Deadline must be obtained or requested, stored as a date.
- Task Retrieval (Overdue/Due Soon): Retrieve overdue tasks from the database. Used to trigger rudeness upon entering the application. Retrieve 'due soon' tasks.
- Sarcastic Task Confirmation: Provide sarcastic confirmation upon successfully adding a task, reinforcing the persona. Rude feedback should only happen when overdue.
- Deadline Monitoring and Rude Reminders: Monitor deadlines. If a task is due soon (24h), or is overdue, deliver a rude reminder based on Personality Mode 2.
- Task Filtering Tool: The bot can use the task information to provide relevant and targeted responses based on task context, like deadlines. LLM determines the 'voice' from prompts.

## Style Guidelines:

- Primary color: Menacing red (#D92B2B) to convey the bot's stern and unforgiving nature.
- Background color: Dark gray (#333333) to establish a somber, serious tone.
- Accent color: Pale yellow (#DBD15A) to highlight urgent deadlines.
- Body and headline font: 'Inter', a grotesque-style sans-serif, conveys neutrality, suitable to contrast against the aggressive UI tone.
- Minimalist and slightly ominous icons will be used to represent tasks and deadlines.  Stopwatch, calendar etc.
- The layout will be clean and efficient, emphasizing the tasks and deadlines. High contrast elements used throughout.
- Subtle animations such as pulsing highlights for tasks with approaching deadlines, combined with text appearing abruptly to show urgency.