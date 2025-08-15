'use client';

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Code, Download, Copy, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ImageToCodePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, GIF, etc.).",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const generateCode = async () => {
    if (!uploadedImage) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "No Prompt Provided",
        description: "Please provide a description or explanation of what you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated code based on prompt
    const mockCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated from Image</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .card {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
        }
        /* Generated based on your prompt: ${prompt} */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Generated Layout</h1>
            <p>This code was generated from your uploaded image and prompt</p>
        </div>
        <div class="content">
            <div class="card">
                <h3>Feature 1</h3>
                <p>Description of the first feature</p>
            </div>
            <div class="card">
                <h3>Feature 2</h3>
                <p>Description of the second feature</p>
            </div>
        </div>
    </div>
</body>
</html>`;

    setGeneratedCode(mockCode);
    setIsLoading(false);
    
    toast({
      title: "Code Generated",
      description: "Your code has been generated successfully from the image and prompt.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied to Clipboard",
      description: "The generated code has been copied to your clipboard.",
    });
  };

      const downloadCode = () => {
      const element = document.createElement("a");
      const file = new Blob([generatedCode], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `generated-code.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Tools
        </Button>
        
        <div className="flex items-center gap-3 mb-4">
          <Image className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Image to Code</h1>
        </div>
        <p className="text-muted-foreground">
          Upload an image and provide a description to generate the corresponding code automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload and Prompt Section */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Upload your UI design</p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image here, or click to select
                      </p>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Select Image
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Description & Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Explain what you want to generate
                </label>
                <Textarea
                  placeholder="Describe the layout, functionality, or specific features you want in the generated code. For example: 'Create a responsive landing page with a hero section, features grid, and contact form'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>



              <Button 
                onClick={generateCode}
                disabled={!uploadedImage || !prompt.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? "Generating Code..." : "Generate Code"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedCode ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    HTML/CSS
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadCode}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedCode}
                  readOnly
                  className="min-h-[500px] font-mono text-sm"
                />
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Generated code will appear here</p>
                <p className="text-sm">Upload an image, add a description, and click "Generate Code" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
