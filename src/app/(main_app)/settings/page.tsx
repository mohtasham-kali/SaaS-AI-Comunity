'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Lock, Camera, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { PasswordSettings } from "@/components/settings/password-settings";
import { AvatarSettings } from "@/components/settings/avatar-settings";
import { AIToolsSettings } from "@/components/settings/ai-tools-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Settings className="mr-3 h-6 w-6 text-primary" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="avatar" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Avatar
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger value="ai-tools" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Tools
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="avatar" className="mt-6">
              <AvatarSettings />
            </TabsContent>
            
            <TabsContent value="password" className="mt-6">
              <PasswordSettings />
            </TabsContent>
            
            <TabsContent value="ai-tools" className="mt-6">
              <AIToolsSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
