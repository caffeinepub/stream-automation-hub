import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Users } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

type ChatMessage = {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
};

export default function ChatRoom() {
  const { data: userProfile } = useGetCallerUserProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'Kagome',
      content: 'Welcome to the Inuyasha Journey chat room!',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      username: 'Inuyasha',
      content: 'Sit boy! Just kidding, welcome everyone!',
      timestamp: new Date(Date.now() - 240000),
    },
  ]);
  const [input, setInput] = useState('');
  const [activeUsers] = useState(['Kagome', 'Inuyasha', 'Miroku', 'Sango', 'Shippo']);

  const handleSend = () => {
    if (!input.trim() || !userProfile) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: userProfile.name,
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div
      className="min-h-[calc(100vh-12rem)] bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/assets/generated/inuyasha-chat-bg.dim_1920x1080.png)' }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-16rem)] flex flex-col border-primary/20">
              <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-primary">⚔️</span>
                  Inuyasha Journey Chat
                  <span className="text-secondary">🌸</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {message.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-foreground">{message.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mt-1">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-primary/20 p-4 bg-card/50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Share your thoughts on the journey..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="border-primary/20"
                    />
                    <Button onClick={handleSend} disabled={!input.trim()} className="gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="border-primary/20">
              <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Active Users ({activeUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {activeUsers.map((user) => (
                    <div key={user} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">{user}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
