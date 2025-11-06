import { apiService } from "@/services/api.service";
import {
  ReservoirCreate,
  ReservoirRead,
  ReservoirUpdate,
  ReservoirPagination,
  ReservoirOperationCreate,
  ReservoirOperationRead,
  ReservoirOperationUpdate,
  ReservoirOperationPagination,
  ReservoirOperationFileRead,
  ReservoirOperationFileUpdate,
  ReservoirOperationFilePagination,
  ReservoirOperationFileUpload,
} from "@/types/reservoirs";
import { storageApi } from "./storage.api";
import { paginationAdapter, PaginationParams } from "@/lib/pagination";

// Reservoirs API Functions
export const reservoirsApi = {
  // Reservoirs
  reservoirs: {
    list: (params?: PaginationParams & { status?: string; location?: string }) =>
      apiService.get<ReservoirPagination>("/reservoirs/reservoirs/", { params: paginationAdapter(params) }),

    create: (data: ReservoirCreate) =>
      apiService.post<ReservoirRead>("/reservoirs/reservoirs/", data),

    get: (reservoirId: number) =>
      apiService.get<ReservoirRead>(`/reservoirs/reservoirs/${reservoirId}`),

    update: (reservoirId: number, data: ReservoirUpdate) =>
      apiService.put<ReservoirRead>(`/reservoirs/reservoirs/${reservoirId}`, data),

    delete: (reservoirId: number) =>
      apiService.delete(`/reservoirs/reservoirs/${reservoirId}`),
  },

  // Reservoir Operations
  operations: {
    list: (params?: PaginationParams & { reservoir_id?: number; start_date?: string; end_date?: string }) =>
      apiService.get<ReservoirOperationPagination>("/reservoirs/reservoir-operations/", { params: paginationAdapter(params) }),

    create: (data: ReservoirOperationCreate) =>
      apiService.post<ReservoirOperationRead>("/reservoirs/reservoir-operations/", data),

    update: (operationId: number, data: ReservoirOperationUpdate) =>
      apiService.put<ReservoirOperationRead>(`/reservoirs/reservoir-operations/${operationId}`, data),

    delete: (operationId: number) =>
      apiService.delete(`/reservoirs/reservoir-operations/${operationId}`),
  },

  // Reservoir Operation Files
  operationFiles: {
    list: (params?: PaginationParams & { reservoir_id?: number; data_type?: string; start_date?: string; end_date?: string }) =>
      apiService.get<ReservoirOperationFilePagination>("/reservoirs/reservoir-operation-files/", { params: paginationAdapter(params) }),

    create: async (data: ReservoirOperationFileUpload, onProgress?: (progress: number) => void) => {
      if (data.file) {
        onProgress?.(1);

        // Get presigned URL
        const { uploadUrl, key } = await storageApi.presign.reservoirs({
          filename: data.file.name,
          content_type: data.file.type,
        });

        onProgress?.(5);

        // Upload to S3
        await storageApi.uploadToS3(uploadUrl, data.file, (percent) => {
          const mappedPercent = 5 + (percent * 0.9);
          onProgress?.(mappedPercent);
        });

        onProgress?.(95);

        // Commit to server
        const result = await storageApi.commit.reservoirs({ key });

        onProgress?.(100);

        return result;
      }
      else {
        return apiService.post<ReservoirOperationFileRead>("/reservoirs/reservoir-operation-files/", data);
      }
    },

    update: (fileId: number, data: ReservoirOperationFileUpdate) =>
      apiService.put<ReservoirOperationFileRead>(`/reservoirs/reservoir-operation-files/${fileId}`, data),

    delete: (fileId: number) =>
      apiService.delete(`/reservoirs/reservoir-operation-files/${fileId}`),
  },
};
