'use server';

/**
 * @fileOverview Improves the writing in a given text note.
 *
 * - improveWriting - A function that takes text as input and returns improved text.
 * - ImproveWritingInput - The input type for the improveWriting function.
 * - ImproveWritingOutput - The return type for the improveWriting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveWritingInputSchema = z.object({
  text: z.string().describe('The text to improve.'),
});
export type ImproveWritingInput = z.infer<typeof ImproveWritingInputSchema>;

const ImproveWritingOutputSchema = z.object({
  improvedText: z.string().describe('The improved text.'),
});
export type ImproveWritingOutput = z.infer<typeof ImproveWritingOutputSchema>;

export async function improveWriting(input: ImproveWritingInput): Promise<ImproveWritingOutput> {
  return improveWritingFlow(input);
}

const improveWritingPrompt = ai.definePrompt({
  name: 'improveWritingPrompt',
  input: {schema: ImproveWritingInputSchema},
  output: {schema: ImproveWritingOutputSchema},
  prompt: `Improve the following text for grammar, clarity, and overall quality:\n\n{{{text}}}`, 
});

const improveWritingFlow = ai.defineFlow(
  {
    name: 'improveWritingFlow',
    inputSchema: ImproveWritingInputSchema,
    outputSchema: ImproveWritingOutputSchema,
  },
  async input => {
    const {output} = await improveWritingPrompt(input);
    return output!;
  }
);
