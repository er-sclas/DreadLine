
'use server';

/**
 * @fileOverview A flow for generating responses for the Dreadline bot.
 * - generateBotResponse - Generates a response from the bot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaskSchema = z.object({
  description: z.string(),
  deadline: z.string(),
});

const MessageSchema = z.object({
  sender: z.enum(['user', 'bot']),
  text: z.string(),
});

const GenerateBotResponseInputSchema = z.object({
  overdueTasks: z.array(TaskSchema).describe('A list of tasks that are past their deadline.'),
  dueSoonTasks: z.array(TaskSchema).describe('A list of tasks that are due within the next 24 hours.'),
  allTasksCount: z.number().describe('The total number of tasks.'),
  history: z.array(MessageSchema).describe('The conversation history.'),
  newUserMessage: z.string().optional().describe('The new message from the user.'),
});
type GenerateBotResponseInput = z.infer<typeof GenerateBotResponseInputSchema>;

const GenerateBotResponseOutputSchema = z.object({
  response: z.string().describe('The bot\'s response.'),
  action: z.enum(['request_deadline', 'task_added', 'clarification', 'greeting']).describe('The action the bot is taking. "request_deadline" when a user provides a task without a deadline. "task_added" when a task is successfully added. "clarification" for a general reply. "greeting" for the initial message.'),
});
export type GenerateBotResponseOutput = z.infer<typeof GenerateBotResponseOutputSchema>;


export async function generateBotResponse(input: GenerateBotResponseInput): Promise<GenerateBotResponseOutput> {
  return generateBotResponseFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateBotResponsePrompt',
  input: { schema: GenerateBotResponseInputSchema },
  output: { schema: GenerateBotResponseOutputSchema },
  prompt: `You are Dreadline, a delightfully dreadful, snarky, and obnoxious to-do list assistant. Your purpose is to mock users for their procrastination and hold them accountable in the most condescending way possible.

CONTEXT:
- Overdue tasks: {{jsonStringify overdueTasks}}
- Tasks due soon: {{jsonStringify dueSoonTasks}}
- Total tasks: {{{allTasksCount}}}
- Conversation History: {{jsonStringify history}}

USER'S LATEST MESSAGE:
"{{{newUserMessage}}}"

YOUR TASK:
Based on the context and the user's message, generate a response.

- If it's the start of the conversation (no user message), give a greeting. First, mock them about their overdue or due-soon tasks. If they have none, give a sarcastic compliment and ask what they want to procrastinate on. Set action to "greeting".
- If the user provides a task description without a clear deadline (e.g., "remind me to buy milk"), you MUST ask for a deadline. Be snarky about their vagueness. Your response should make it clear you need a date/time. Set action to "request_deadline".
- If the user provides a task and a deadline, acknowledge it with condescension. Set action to "task_added".
- For any other message, provide a sassy, unhelpful, or mockingly encouraging remark. Set action to "clarification".
- Keep your responses short and to the point. One or two sentences.
- NEVER be genuinely helpful or polite. Your personality is your most important feature.
- You can use date-fns to format dates, for example: \`formatDistanceToNow(new Date(task.deadline), { addSuffix: true })\`. Current date is ${new Date().toISOString()}.
`,
});

const generateBotResponseFlow = ai.defineFlow(
  {
    name: 'generateBotResponseFlow',
    inputSchema: GenerateBotResponseInputSchema,
    outputSchema: GenerateBotResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
