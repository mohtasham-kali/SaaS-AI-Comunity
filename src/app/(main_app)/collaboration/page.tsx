
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ListChecks, MessageSquare, PlusCircle, Edit2, Mail, CalendarDays, Send } from "lucide-react";
import { format } from 'date-fns';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarFallback: string;
  data_ai_hint?: string;
}

interface Task {
  id: string;
  title: string;
  assignedToId: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string; 
  description?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  userAvatarFallback: string;
  message: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Alice Coder', email: 'alice@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=AC', avatarFallback: 'AC', data_ai_hint: 'female avatar' },
  { id: 'tm2', name: 'Bob Debugger', email: 'bob@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=BD', avatarFallback: 'BD', data_ai_hint: 'male avatar' },
  { id: 'tm3', name: 'Charlie Dev', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=CD', avatarFallback: 'CD', data_ai_hint: 'person avatar' },
];

const mockTasks: Task[] = [
  { id: 'task1', title: 'Implement User Authentication Flow', assignedToId: 'tm1', status: 'In Progress', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'Setup email/password login and registration.' },
  { id: 'task2', title: 'Design Collaboration Page UI', assignedToId: 'tm2', status: 'To Do', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), description: 'Create mockups for the team collaboration interface.' },
  { id: 'task3', title: 'Refactor API Endpoints', assignedToId: 'tm1', status: 'Done', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Optimize performance of existing REST APIs.' },
  { id: 'task4', title: 'Write Unit Tests for Payment Module', assignedToId: 'tm3', status: 'To Do', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), description: 'Ensure 90% code coverage for critical payment functions.' },
];

const mockChatMessages: ChatMessage[] = [
    { id: 'msg1', userId: 'tm1', userName: 'Alice Coder', userAvatarFallback: 'AC', message: 'Hey team, how is the user auth flow coming along?', timestamp: new Date(Date.now() - 60 * 60 * 1000 * 2).toISOString() },
    { id: 'msg2', userId: 'tm2', userName: 'Bob Debugger', userAvatarFallback: 'BD', message: 'Good progress! Just working on the password reset part.', timestamp: new Date(Date.now() - 60 * 60 * 1000 * 1.5).toISOString() },
    { id: 'msg3', userId: 'user-current', userName: 'You', userAvatarFallback: 'ME', message: 'Great! Let me know if you need help with the UI for that.', timestamp: new Date(Date.now() - 60 * 60 * 1000 * 1).toISOString(), isCurrentUser: true },
    { id: 'msg4', userId: 'tm3', userName: 'Charlie Dev', userAvatarFallback: 'CD', message: 'I can help with testing once it\'s ready.', timestamp: new Date(Date.now() - 60 * 60 * 1000 * 0.5).toISOString()},
];


const getTaskStatusBadgeVariant = (status: Task['status']): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'To Do': return "outline";
    case 'In Progress': return "default"; 
    case 'Done': return "secondary"; 
    default: return "outline";
  }
};


export default function CollaborationPage() {
  const getAssignee = (assigneeId: string): TeamMember | undefined => {
    return mockTeamMembers.find(member => member.id === assigneeId);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Team & Collaboration Hub
          </CardTitle>
          <CardDescription className="text-lg">
            Connect with your team, manage tasks, and communicate effectively. AI assistance is integrated to boost productivity.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Team Members Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-3 h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Team Members</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="cursor-not-allowed">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Member (Conceptual)
          </Button>
        </CardHeader>
        <CardContent>
          {mockTeamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTeamMembers.map(member => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="items-center text-center p-4">
                    <Avatar className="h-20 w-20 mb-3 border-2 border-primary">
                      <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.data_ai_hint} />
                      <AvatarFallback className="text-2xl">{member.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-xs flex items-center text-muted-foreground">
                        <Mail className="h-3 w-3 mr-1"/>{member.email}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-3 border-t flex justify-center">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 cursor-not-allowed">
                      Assign Task (Conceptual)
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No team members added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
           <div className="flex items-center">
            <ListChecks className="mr-3 h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Team Tasks</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="cursor-not-allowed">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task (Conceptual)
          </Button>
        </CardHeader>
        <CardContent>
          {mockTasks.length > 0 ? (
            <div className="space-y-4">
              {mockTasks.map(task => {
                const assignee = getAssignee(task.assignedToId);
                return (
                  <Card key={task.id} className="bg-muted/30 hover:shadow-sm transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <Badge variant={getTaskStatusBadgeVariant(task.status)} 
                               className={task.status === 'Done' ? 'bg-green-500/80 hover:bg-green-500/90 text-white' : 
                                            task.status === 'In Progress' ? 'bg-primary/80 hover:bg-primary/90 text-primary-foreground' : ''}>
                          {task.status}
                        </Badge>
                      </div>
                      {task.description && <CardDescription className="text-xs mt-1">{task.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-foreground/90 mr-2">Assigned to:</span>
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint={assignee.data_ai_hint} />
                              <AvatarFallback className="text-xs">{assignee.avatarFallback}</AvatarFallback>
                            </Avatar>
                            <span>{assignee.name}</span>
                          </div>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1.5 text-primary"/>
                        <span className="font-medium text-foreground/90 mr-1">Due:</span>
                        {format(new Date(task.dueDate), "MMMM d, yyyy")}
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 border-t flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-xs cursor-not-allowed">
                            <Edit2 className="h-3 w-3 mr-1"/> Edit (Conceptual)
                        </Button>
                         <Button variant="ghost" size="sm" className="text-xs cursor-not-allowed text-green-600 hover:text-green-500" disabled={task.status === 'Done'}>
                            Mark Complete (Conceptual)
                        </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No tasks assigned yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Team Chat Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <MessageSquare className="mr-3 h-6 w-6 text-primary" />
            Team Chat (Conceptual)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          <ScrollArea className="flex-grow h-full p-4 border rounded-md bg-muted/20 mb-4">
            <div className="space-y-4">
              {mockChatMessages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.isCurrentUser ? 'justify-end' : ''}`}>
                  {!msg.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.userAvatarUrl} data-ai-hint="chat avatar" />
                      <AvatarFallback>{msg.userAvatarFallback}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                      {msg.userName}, {format(new Date(msg.timestamp), "p")}
                    </p>
                  </div>
                  {msg.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.userAvatarUrl} data-ai-hint="my avatar"/>
                      <AvatarFallback>{msg.userAvatarFallback}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {mockChatMessages.length === 0 && (
                <p className="text-muted-foreground text-center py-10">No messages yet. Start the conversation!</p>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2">
            <Input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-grow text-base p-3"
              disabled // Conceptual
            />
            <Button size="lg" disabled className="cursor-not-allowed">
              <Send className="h-5 w-5 mr-2" /> Send
            </Button>
          </div>
           <p className="text-xs text-muted-foreground mt-2">
            Real-time chat functionality requires backend integration. This is a visual mock-up.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}

