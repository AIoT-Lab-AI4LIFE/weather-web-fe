import { useState } from "react";
import { notification } from "antd";
import { storageApi } from "@/services/apis/storage.api";

export interface UploadProgress {
  percent: number;
  status: "uploading" | "success" | "error" | "idle";
}

export function usePresignedUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    percent: 0,
    status: "idle",
  });

  const uploadFile = async (params: {
    file: File;
    presignFn: () => Promise<{ uploadUrl: string; key: string }>;
    commitFn: (key: string) => Promise<any>;
  }) => {
    const { file, presignFn, commitFn } = params;

    try {
      setProgress({ percent: 0, status: "uploading" });

      // Step 1: Get presigned URL (5% progress)
      setProgress({ percent: 5, status: "uploading" });
      const { uploadUrl, key } = await presignFn();

      // Step 2: Upload to S3 (5% to 95% progress)
      await storageApi.uploadToS3(uploadUrl, file, (percent) => {
        // Map 0-100 to 5-90
        const mappedPercent = 5 + (percent * 0.85);
        setProgress({ percent: mappedPercent, status: "uploading" });
      });

      // Step 3: Commit to server (95% progress)
      setProgress({ percent: 95, status: "uploading" });
      const result = await commitFn(key);

      // Step 4: Complete (100% progress)
      setProgress({ percent: 100, status: "success" });

      notification.success({
        message: "Upload successful",
        description: `File ${file.name} uploaded successfully`,
      });

      return result;
    }
    catch (error: any) {
      setProgress({ percent: 0, status: "error" });

      notification.error({
        message: "Upload failed",
        description: error?.message || "An error occurred during upload",
      });

      throw error;
    }
  };

  const resetProgress = () => {
    setProgress({ percent: 0, status: "idle" });
  };

  return {
    progress,
    uploadFile,
    resetProgress,
    isUploading: progress.status === "uploading",
  };
}
