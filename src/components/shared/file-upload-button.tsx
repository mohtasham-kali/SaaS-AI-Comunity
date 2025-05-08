'use client';

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import type { UploadedFile } from "@/types";

interface FileUploadButtonProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number; // Max size per file in MB
  currentPlan?: "free" | "premium";
}

export function FileUploadButton({ 
  onFilesSelected, 
  currentPlan = "free" 
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planLimits = {
    free: { maxFiles: 3, maxSizeMB: 5 },
    premium: { maxFiles: 10, maxSizeMB: 100 },
  };

  const limits = planLimits[currentPlan];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const selectedFiles: UploadedFile[] = filesArray
        .slice(0, limits.maxFiles) // Respect max files limit
        .filter(file => file.size <= limits.maxSizeMB * 1024 * 1024) // Respect max size limit
        .map((file, index) => ({
          id: `temp-file-${Date.now()}-${index}`,
          name: file.name,
          url: URL.createObjectURL(file), // Temporary URL for preview if needed
          type: file.type,
          size: file.size,
        }));
      
      // TODO: Add toast notifications for exceeding limits

      onFilesSelected(selectedFiles);
      
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,application/pdf,.doc,.docx,.txt,.js,.ts,.py,.java,.c,.cpp,.cs,.html,.css,.json,.xml" 
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Files
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        Max {limits.maxFiles} files, up to {limits.maxSizeMB}MB each.
      </p>
    </>
  );
}
