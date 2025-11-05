
'use server';

/**
 * @fileOverview Summarizes the details of a given task.
 *
 * - summarizeTaskDetails - A function that summarizes task details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTaskDetailsInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  deadline: z.string().describe('The deadline of the task in ISO 8601 format.'),
});
type SummarizeTaskDetailsInput = z.infer<typeof SummarizeTaskDetailsInputSchema>;

const SummarizeTaskDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the task details.'),
});
export type SummarizeTaskDetailsOutput = z.infer<typeof SummarizeTaskDetailsOutputSchema>;

export async function summarizeTaskDetails(input: SummarizeTaskDetailsInput): Promise<SummarizeTaskDetailsOutput> {
  return summarizeTaskDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTaskDetailsPrompt',
  input: {schema: SummarizeTaskDetailsInputSchema},
  output: {schema: SummarizeTaskDetailsOutputSchema},
  prompt: `Summarize the following task details in a concise and informative way:\n\nTask Description: {{{taskDescription}}}\nDeadline: {{{deadline}}}`,
});

const summarizeTaskDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeTaskDetailsFlow',
    inputSchema: SummarizeTaskDetailsInputSchema,
    outputSchema: SummarizeTaskDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
