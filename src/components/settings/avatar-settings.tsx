'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AvatarSettings() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, GIF, etc.).",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "No File Selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would upload the file to your backend/storage service
    // and update the user's profile with the new image URL
    
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated successfully.",
    });
    
    setIsLoading(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setIsLoading(true);
    
    // Simulate API call to remove avatar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been removed.",
    });
    
    setIsLoading(false);
    setPreviewUrl(null);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Avatar Display */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={previewUrl || currentUser?.image || undefined} 
              alt={currentUser?.name || "User"} 
            />
            <AvatarFallback className="text-lg">
              {getInitials(currentUser?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">Current Avatar</h4>
            <p className="text-sm text-muted-foreground">
              {currentUser?.image ? "Custom profile picture" : "Default avatar"}
            </p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="avatar-upload" className="text-sm font-medium">
              Upload New Picture
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: JPEG, PNG, GIF. Max size: 5MB
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="max-w-xs"
            />
            <Button
              onClick={handleUpload}
              disabled={isLoading || !previewUrl}
              size="sm"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={previewUrl} alt="Preview" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Preview</p>
                <p className="text-xs text-muted-foreground">
                  This is how your new avatar will look
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPreviewUrl(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Remove Avatar Button */}
        {currentUser?.image && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleRemoveAvatar}
              disabled={isLoading}
              className="text-destructive hover:text-destructive"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <X className="mr-2 h-4 w-4" />
              Remove Current Avatar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
