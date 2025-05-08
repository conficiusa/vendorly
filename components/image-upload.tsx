"use client";

import { UserCircle2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { OnboardingFormData } from "@/lib/schemas/auth-schemas/onboarding-schema";
import { UseFormReturn } from "react-hook-form";
import { Button } from "./ui/button";

interface ImageUploadProps {
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  form: UseFormReturn<OnboardingFormData>;
  onSubmit: (data: OnboardingFormData) => Promise<void>;
}

export default function ImageUpload({
  imagePreview,
  setImagePreview,
  form,
  onSubmit,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  // Abort upload when form is submitting
  useEffect(() => {
    if (form.formState.isSubmitting && abortController) {
      abortController.abort();
    }
  }, [form.formState.isSubmitting, abortController]);

  const { startUpload } = useUploadThing("profileImageUploader", {
    onUploadError: (error: Error) => {
      toast.error(error.message);
      setIsUploading(false);
      setAbortController(null);
    },
    onClientUploadComplete: async () => {
      form.handleSubmit(onSubmit);
      setAbortController(null);
    },
    signal: abortController?.signal,
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create temporary preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const controller = new AbortController();
      setAbortController(controller);

      // Set timeout to abort after 30 seconds
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 1000);

      const response = await startUpload([selectedFile]);
      clearTimeout(timeoutId);

      if (response && response[0]) {
        setImagePreview(response[0].url);
        setTempPreview(null);
        setSelectedFile(null);
      }
    } catch (err: any) {
      if (err.name === "UploadAbortedError") {
        toast.error("Upload was cancelled");
      } else {
        console.error("Upload error:", err);
        toast.error("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
    }
    setSelectedFile(null);
    setTempPreview(null);
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden">
        {imagePreview || tempPreview ? (
          <Image
            src={imagePreview || tempPreview || ""}
            alt="Profile preview"
            className="w-full h-full object-cover"
            fill
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <UserCircle2 className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {tempPreview ? (
          <>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || form.formState.isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
            <Button type="button" onClick={handleCancel} variant="ghost">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <label className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Remove Image
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
