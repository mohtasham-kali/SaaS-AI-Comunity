
'use client';

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import type { UploadedFile } from "@/types";

interface FileUploadButtonProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  onRawFilesSelected?: (files: File[]) => void; // Optional: For direct File object access
  maxFiles?: number;
  maxSizeMB?: number; // Max size per file in MB
  currentPlan?: "free" | "premium";
  accept?: string; // Added accept prop
}

export function FileUploadButton({ 
  onFilesSelected, 
  onRawFilesSelected,
  currentPlan = "free",
  accept = "image/*,application/pdf,.doc,.docx,.txt,.js,.ts,.py,.java,.c,.cpp,.cs,.html,.css,.json,.xml" // Default accept
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
      
      const validRawFiles: File[] = filesArray
        .filter(file => file.size <= limits.maxSizeMB * 1024 * 1024) // Respect max size limit
        .slice(0, limits.maxFiles); // Respect max files limit after filtering by size

      const selectedUploadedFiles: UploadedFile[] = validRawFiles
        .map((file, index) => ({
          id: `temp-file-${Date.now()}-${index}`,
          name: file.name,
          url: URL.createObjectURL(file), // Temporary URL for preview
          type: file.type,
          size: file.size,
        }));
      
      // TODO: Add toast notifications for exceeding limits (if any files were filtered out)

      onFilesSelected(selectedUploadedFiles);
      if (onRawFilesSelected) {
        onRawFilesSelected(validRawFiles);
      }
      
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
        accept={accept} 
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
        Max {limits.maxFiles} files, up to {limits.maxSizeMB}MB each. Accepted types: {accept === "image/*,application/pdf,.doc,.docx,.txt,.js,.ts,.py,.java,.c,.cpp,.cs,.html,.css,.json,.xml" ? "various" : accept}.
      </p>
    </>
  );
}

