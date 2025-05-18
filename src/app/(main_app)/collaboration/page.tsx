
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, MessageSquare } from "lucide-react"; // Added Bot and MessageSquare for more relevant icons

export default function CollaborationPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Users className="mr-3 h-6 w-6 text-primary" />
            Team & Collaboration Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Connect with your team, chat in real-time, and leverage AI for enhanced collaboration. This section is currently under development.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center space-y-4">
            <div className="flex justify-center items-center gap-4 text-primary">
                <MessageSquare className="h-10 w-10" />
                <Users className="h-10 w-10" />
                <Bot className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold">Real-time Chat & AI-Powered Teamwork!</h3>
            <p className="mt-2 text-muted-foreground">
              Features for seamless team communication, shared workspaces, and AI-assisted collaboration tools are coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
