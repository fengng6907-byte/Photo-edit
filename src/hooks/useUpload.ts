"use client";

import { useState, useCallback } from "react";
import { IMAGE_TYPES, VIDEO_TYPES, MAX_IMAGE_SIZE_MB, MAX_VIDEO_SIZE_MB, isValidFileType, isValidFileSize } from "@/lib/utils";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedUrl: string | null;
  uploadId: string | null;
}

interface UseUploadOptions {
  onSuccess?: (url: string, uploadId: string) => void;
  onError?: (error: string) => void;
}

export function useUpload({ onSuccess, onError }: UseUploadOptions = {}) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedUrl: null,
    uploadId: null,
  });

  const upload = useCallback(async (file: File) => {
    // Validate file type
    const isImage = isValidFileType(file, IMAGE_TYPES);
    const isVideo = isValidFileType(file, VIDEO_TYPES);

    if (!isImage && !isVideo) {
      const err = "Unsupported file type. Please upload JPG, PNG, WEBP, HEIC, MP4, MOV, or WEBM.";
      setState((s) => ({ ...s, error: err }));
      onError?.(err);
      return;
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
    if (!isValidFileSize(file, maxSize)) {
      const err = `File too large. Max ${maxSize}MB for ${isImage ? "images" : "videos"}.`;
      setState((s) => ({ ...s, error: err }));
      onError?.(err);
      return;
    }

    setState({ isUploading: true, progress: 0, error: null, uploadedUrl: null, uploadId: null });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        const err = data.error ?? "Upload failed";
        setState({ isUploading: false, progress: 0, error: err, uploadedUrl: null, uploadId: null });
        onError?.(err);
        return;
      }

      const data = await response.json();
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        uploadedUrl: data.url,
        uploadId: data.uploadId,
      });
      onSuccess?.(data.url, data.uploadId);
    } catch {
      const err = "Upload failed — please try again";
      setState({ isUploading: false, progress: 0, error: err, uploadedUrl: null, uploadId: null });
      onError?.(err);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null, uploadedUrl: null, uploadId: null });
  }, []);

  return { ...state, upload, reset };
}
