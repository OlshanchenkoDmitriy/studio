'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const specialCharacters = [
  '-', '~', ',', '>', '{', '}', '|', '\\',
  '^', '=', '/', ':', ';', '.', '(', ')',
  '[', ']', '"', "'", '`', '!', '?', '@',
  '#', '$', '%', '&', '*', '_', '+'
];

export default function ToolsView() {
  const [text, setText] = useState('');

  const handleRemoveChar = (charToRemove: string) => {
    const regex = new RegExp(`\\${charToRemove}`, 'g');
    setText(prevText => prevText.replace(regex, ''));
  };

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="min-h-[200px] text-base"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remove Specific Characters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {specialCharacters.map((char) => (
                <Button
                  key={char}
                  variant="outline"
                  className="text-lg font-mono aspect-square h-14 w-14"
                  onClick={() => handleRemoveChar(char)}
                  aria-label={`Remove ${char}`}
                >
                  {char}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
