"use client";

import { useState, useCallback } from "react";

interface AIProcessOptions {
  jobType: string;
  inputUrl: string;
  settings?: Record<string, unknown>;
  onSuccess?: (outputUrl: string) => void;
  onError?: (error: string) => void;
}

interface AIProcessState {
  isProcessing: boolean;
  jobId: string | null;
  error: string | null;
  progress: number;
}

export function useAIProcess() {
  const [state, setState] = useState<AIProcessState>({
    isProcessing: false,
    jobId: null,
    error: null,
    progress: 0,
  });

  const process = useCallback(async ({ jobType, inputUrl, settings, onSuccess, onError }: AIProcessOptions) => {
    setState({ isProcessing: true, jobId: null, error: null, progress: 0 });

    try {
      const response = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobType, inputUrl, settings }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error ?? "Processing failed";
        setState({ isProcessing: false, jobId: null, error: errorMsg, progress: 0 });
        onError?.(errorMsg);
        return;
      }

      const { jobId } = await response.json();
      setState((s) => ({ ...s, jobId, progress: 10 }));

      // Poll for job status
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/ai/process?jobId=${jobId}`);
        if (!statusRes.ok) return;
        const job = await statusRes.json();

        if (job.status === "completed") {
          clearInterval(pollInterval);
          setState({ isProcessing: false, jobId, error: null, progress: 100 });
          onSuccess?.(job.output_url);
        } else if (job.status === "failed") {
          clearInterval(pollInterval);
          const errMsg = job.error ?? "Processing failed";
          setState({ isProcessing: false, jobId, error: errMsg, progress: 0 });
          onError?.(errMsg);
        } else {
          setState((s) => ({ ...s, progress: Math.min(s.progress + 15, 90) }));
        }
      }, 2000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setState({ isProcessing: false, jobId, error: "Processing timed out", progress: 0 });
        onError?.("Processing timed out");
      }, 300000);
    } catch {
      const errMsg = "Network error — please try again";
      setState({ isProcessing: false, jobId: null, error: errMsg, progress: 0 });
      onError?.(errMsg);
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isProcessing: false, jobId: null, error: null, progress: 0 });
  }, []);

  return { ...state, process, reset };
}
