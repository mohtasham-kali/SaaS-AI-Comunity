
'use client';

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef } from "react";
import type { UploadedFile, Plan } from "@/types"; // Ensure Plan is imported

interface FileUploadButtonProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  onRawFilesSelected?: (files: File[]) => void;
  currentPlan?: Plan; // Use the Plan type
  accept?: string;
}

const fileUploadLimitsByPlan = {
  free: { maxFiles: 3, maxSizeMB: 5 },
  Standard: { maxFiles: 10, maxSizeMB: 20 },
  Community: { maxFiles: 20, maxSizeMB: 100 },
};

export function FileUploadButton({ 
  onFilesSelected, 
  onRawFilesSelected,
  currentPlan = "free",
  accept = "image/*,application/pdf,.doc,.docx,.txt,.js,.ts,.py,.java,.c,.cpp,.cs,.html,.css,.json,.xml" 
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limits = fileUploadLimitsByPlan[currentPlan];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      
      const validRawFiles: File[] = filesArray
        .filter(file => file.size <= limits.maxSizeMB * 1024 * 1024) 
        .slice(0, limits.maxFiles); 

      const selectedUploadedFiles: UploadedFile[] = validRawFiles
        .map((file, index) => ({
          id: `temp-file-${Date.now()}-${index}`,
          name: file.name,
          url: URL.createObjectURL(file), 
          type: file.type,
          size: file.size,
        }));
      
      onFilesSelected(selectedUploadedFiles);
      if (onRawFilesSelected) {
        onRawFilesSelected(validRawFiles);
      }
      
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
