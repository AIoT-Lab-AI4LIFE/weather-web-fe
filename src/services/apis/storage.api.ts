import axios from "axios";
import { apiService } from "@/services/api.service";
import {
  StorageUploadRequest,
  StorageUploadResponse,
  PresignRequest,
  PresignResponse,
  CommitUploadResponse,
} from "@/types/storage";

export const storageApi = {
  // New presigned URL flow
  presign: {
    // Get presigned URL for storms
    storms: async (data: {
      filename: string;
      content_type?: string;
      storm_id: number;
      issued_date: string;
      data_type: string;
    }): Promise<PresignResponse> => {
      const formData = new FormData();
      formData.append("filename", data.filename);
      if (data.content_type) {
        formData.append("content_type", data.content_type);
      }
      formData.append("storm_id", data.storm_id.toString());
      formData.append("issued_date", data.issued_date);
      formData.append("data_type", data.data_type);

      return apiService.post<PresignResponse>("/storage/presign/storms", formData);
    },

    // Get presigned URL for reservoirs
    reservoirs: async (data: {
      filename: string;
      content_type?: string;
    }): Promise<PresignResponse & { issuedDate: string }> => {
      const formData = new FormData();
      formData.append("filename", data.filename);
      if (data.content_type) {
        formData.append("content_type", data.content_type);
      }

      return apiService.post<PresignResponse & { issuedDate: string }>("/storage/presign/reservoirs", formData);
    },

    // Generic presign endpoint
    generic: async (data: PresignRequest): Promise<PresignResponse> => {
      const formData = new FormData();
      formData.append("filename", data.filename);
      formData.append("content_type", data.content_type);
      if (data.path) {
        formData.append("path", data.path);
      }
      if (data.storm_id !== undefined) {
        formData.append("storm_id", data.storm_id.toString());
      }
      if (data.reservoir_id !== undefined) {
        formData.append("reservoir_id", data.reservoir_id.toString());
      }
      if (data.issued_date) {
        formData.append("issued_date", data.issued_date);
      }
      if (data.data_type) {
        formData.append("data_type", data.data_type);
      }

      return apiService.post<PresignResponse>("/storage/presign", formData);
    },
  },

  // Upload file directly to S3 using presigned URL
  uploadToS3: async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<void> => {
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Commit upload to server after S3 upload
  commit: {
    storms: async (data: {
      key: string;
      storm_id: number;
      issued_date: string;
      data_type: string;
    }): Promise<CommitUploadResponse> => {
      return apiService.post<CommitUploadResponse>("/storage/commit/storms", data);
    },

    reservoirs: async (data: {
      key: string;
    }): Promise<CommitUploadResponse> => {
      return apiService.post<CommitUploadResponse>("/storage/commit/reservoirs", data);
    },
  },

  // Legacy direct upload (kept for backward compatibility)
  upload: async (data: StorageUploadRequest): Promise<StorageUploadResponse> => {
    // Create FormData for file upload
    const formData = new FormData();

    // Add the file
    formData.append("file", data.file);

    // Add data type
    formData.append("data_type", data.data_type);

    // Add optional path field if provided
    if (data.path !== undefined && data.path !== null) {
      formData.append("path", data.path);
    }

    // Add storm-specific fields
    if (data.storm_id !== undefined) {
      formData.append("storm_id", data.storm_id.toString());
    }
    if (data.issued_date !== undefined) {
      formData.append("issued_date", data.issued_date);
    }

    // Add reservoir-specific fields
    if (data.reservoir_id !== undefined) {
      formData.append("reservoir_id", data.reservoir_id.toString());
    }
    if (data.from_time !== undefined) {
      formData.append("from_time", data.from_time);
    }
    if (data.to_time !== undefined) {
      formData.append("to_time", data.to_time);
    }

    // Add precipitation-specific fields
    if (data.s2s_id !== undefined) {
      formData.append("s2s_id", data.s2s_id.toString());
    }
    if (data.added_time !== undefined) {
      formData.append("added_time", data.added_time);
    }

    return apiService.post<StorageUploadResponse>("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
