
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileStack } from "lucide-react";

export default function ManagePostsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <FileStack className="mr-3 h-6 w-6 text-primary" />
            Manage Posts (Admin)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            Content moderation tools for administrators. This section is currently under development.
          </p>
          <div className="mt-6 p-8 bg-muted/50 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Content Moderation Tools!</h3>
            <p className="mt-2 text-muted-foreground">
              Functionality to manage community posts will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
