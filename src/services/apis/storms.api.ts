import { apiService } from "@/services/api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import {
  BestTrackFileRead,
  BestTrackFileUpdate,
  BestTrackFileUpload,
  HRESDataCreate,
  HRESDataRead,
  HRESDataUpdate,
  NWPDataCreate,
  NWPDataRead,
  NWPDataUpdate,
  StormCreate,
  StormLifecycleCreate,
  StormLifecycleRead,
  StormLifecycleUpdate,
  StormRead,
  StormUpdate,
} from "@/types/storms";
import { storageApi } from "./storage.api";
import { paginationAdapter, PaginationParams } from "@/lib/pagination";

// Storms API Functions
export const stormsApi = {
  // Storms
  storms: {
    list: (params?: PaginationParams) =>
      apiService.get<PaginatedResult<StormRead>>("/storms/storms/", { params: paginationAdapter(params) }),

    create: (data: StormCreate) =>
      apiService.post<StormRead>("/storms/storms/", data),

    get: (stormId: number) =>
      apiService.get<StormRead>(`/storms/storms/${stormId}`),

    update: (stormId: number, data: StormUpdate) =>
      apiService.put<StormRead>(`/storms/storms/${stormId}`, data),

    delete: (stormId: number) =>
      apiService.delete(`/storms/storms/${stormId}`),
  },

  // BestTrack Files
  bestTrackFiles: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<PaginatedResult<BestTrackFileRead>>("/storms/besttrack-files/", { params }),

    create: async (data: BestTrackFileUpload, onProgress?: (progress: number) => void) => {
      if (!data.file) {
        throw new Error("File is required");
      }

      onProgress?.(1);

      const formattedDate = new Date(data.issued_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");

      // Get presigned URL
      const { uploadUrl, key } = await storageApi.presign.storms({
        filename: data.file.name,
        content_type: data.file.type,
        storm_id: data.storm_id,
        issued_date: formattedDate,
        data_type: "BESTTRACK",
      });

      onProgress?.(5);

      // Upload to S3
      await storageApi.uploadToS3(uploadUrl, data.file, (percent) => {
        const mappedPercent = 5 + (percent * 0.9);
        onProgress?.(mappedPercent);
      });

      onProgress?.(95);

      // Commit to server
      const result = await storageApi.commit.storms({
        key,
        storm_id: data.storm_id,
        issued_date: formattedDate,
        data_type: "BESTTRACK",
      });

      onProgress?.(100);

      return result;
    },

    update: (fileId: string, data: BestTrackFileUpdate) =>
      apiService.put<BestTrackFileRead>(`/storms/besttrack-files/${fileId}`, data),

    delete: (fileId: string) =>
      apiService.delete(`/storms/besttrack-files/${fileId}`),
  },

  // NWP Data
  nwpData: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<PaginatedResult<NWPDataRead>>("/storms/nwp-data/", { params: paginationAdapter(params) }),

    create: async (data: NWPDataCreate & { file?: File }, onProgress?: (progress: number) => void) => {
      if (data.file) {
        onProgress?.(1);
        const formattedDate = new Date(data.issued_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");

        // Get presigned URL
        const { uploadUrl, key } = await storageApi.presign.storms({
          filename: data.file.name,
          content_type: data.file.type,
          storm_id: data.storm_id,
          issued_date: formattedDate,
          data_type: "NWP",
        });
        onProgress?.(5);

        // Upload to S3
        await storageApi.uploadToS3(uploadUrl, data.file, (percent) => {
          const mappedPercent = 5 + (percent * 0.9);
          onProgress?.(mappedPercent);
        });

        onProgress?.(95);

        // Commit to server
        const result = await storageApi.commit.storms({
          key,
          storm_id: data.storm_id,
          issued_date: formattedDate,
          data_type: "NWP",
        });

        onProgress?.(100);

        return result;
      }
      else {
        return apiService.post<NWPDataRead>("/storms/nwp-data/", data);
      }
    },

    update: (dataId: string, data: NWPDataUpdate) =>
      apiService.put<NWPDataRead>(`/storms/nwp-data/${dataId}`, data),

    delete: (dataId: string) =>
      apiService.delete(`/storms/nwp-data/${dataId}`),
  },

  // HRES Data
  hresData: {
    list: (params?: PaginationParams & { storm_id?: number }) =>
      apiService.get<PaginatedResult<HRESDataRead>>("/storms/hres-data/", { params: paginationAdapter(params) }),

    create: async (data: HRESDataCreate & { file?: File }, onProgress?: (progress: number) => void) => {
      if (data.file) {
        const formattedDate = new Date(data.issued_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");

        onProgress?.(1);

        // Get presigned URL
        const { uploadUrl, key } = await storageApi.presign.storms({
          filename: data.file.name,
          content_type: data.file.type,
          storm_id: data.storm_id,
          issued_date: formattedDate,
          data_type: "HRES",
        });

        onProgress?.(5);

        // Upload to S3
        await storageApi.uploadToS3(uploadUrl, data.file, (percent) => {
          const mappedPercent = 5 + (percent * 0.9);
          onProgress?.(mappedPercent);
        });

        // Commit to server
        const result = await storageApi.commit.storms({
          key,
          storm_id: data.storm_id,
          issued_date: formattedDate,
          data_type: "HRES",
        });

        onProgress?.(100);

        return result;
      }
      else {
        return apiService.post<HRESDataRead>("/storms/hres-data/", data);
      }
    },

    update: (dataId: string, data: HRESDataUpdate) =>
      apiService.put<HRESDataRead>(`/storms/hres-data/${dataId}`, data),

    delete: (dataId: string) =>
      apiService.delete(`/storms/hres-data/${dataId}`),
  },

  stormLifecycle: {
    list: (params?: PaginationParams & { storm_ids?: number[]; start_date?: string; end_date?: string }) =>
      apiService.get<PaginatedResult<StormLifecycleRead>>("/storms/storm-lifecycle/", { params: paginationAdapter(params) }),

    create: (data: StormLifecycleCreate) =>
      apiService.post<StormLifecycleRead>("/storms/storm-lifecycle/", data),

    get: (stormId: number) =>
      apiService.get<StormLifecycleRead>(`/storms/storm-lifecycle/${stormId}`),

    update: (stormId: number, data: StormLifecycleUpdate) =>
      apiService.put<StormLifecycleRead>(`/storms/storm-lifecycle/${stormId}`, data),

    delete: (stormId: number) =>
      apiService.delete(`/storms/storm-lifecycle/${stormId}`),
  },

  runStorm: {
    run: (stormId: number) =>
      apiService.post(`/storms/storms/${stormId}/run`),

    runHightest: () =>
      apiService.post(`/storms/storms/run-highest`),
  },
};
