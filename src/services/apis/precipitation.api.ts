import { paginationAdapter, PaginationParams } from "@/lib/pagination";
import { apiService } from "@/services/api.service";
import { RainfallRecordCreate, RainfallRecordPagination, RainfallRecordRead, RainfallRecordUpdate, S2SFilePagination, S2SFileRead, S2SFileUpdate, S2SFileUpload, StationCreate, StationPagination, StationRead, StationUpdate } from "@/types/precipitation";
import { storageApi } from "./storage.api";

// Station API Functions
export const precipitationApi = {
  // Stations
  stations: {
    list: (params?: PaginationParams) =>
      apiService.get<StationPagination>("/precipitation/stations/", { params: paginationAdapter(params) }),

    create: (data: StationCreate) =>
      apiService.post<StationRead>("/precipitation/stations/", data),

    get: (stationId: number) =>
      apiService.get<StationRead>(`/precipitation/stations/${stationId}`),

    update: (stationId: number, data: StationUpdate) =>
      apiService.put<StationRead>(`/precipitation/stations/${stationId}`, data),

    delete: (stationId: number) =>
      apiService.delete(`/precipitation/stations/${stationId}`),
  },

  // Rainfall Records
  rainfallRecords: {
    list: (params?: PaginationParams & { station_id?: number; start_date?: string; end_date?: string }) =>
      apiService.get<RainfallRecordPagination>("/precipitation/rainfall-records/", { params: paginationAdapter(params) }),

    create: (data: RainfallRecordCreate) =>
      apiService.post<RainfallRecordRead>("/precipitation/rainfall-records/", data),

    update: (recordId: number, data: RainfallRecordUpdate) =>
      apiService.put<RainfallRecordRead>(`/precipitation/rainfall-records/${recordId}`, data),

    delete: (recordId: number) =>
      apiService.delete(`/precipitation/rainfall-records/${recordId}`),
  },

  // S2S Files
  s2sFiles: {
    list: (params?: PaginationParams & { data_type?: string; start_date?: string; end_date?: string }) =>
      apiService.get<S2SFilePagination>("/precipitation/s2s-files/", { params: paginationAdapter(params) }),

    create: async (data: S2SFileUpload, onProgress?: (progress: number) => void) => {
      if (data.file) {
        const formattedAddedTime = data.added_time ? new Date(data.added_time).toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "") : new Date().toISOString().slice(0, 13).replace(/[-T:]/g, "").replace("Z", "");

        onProgress?.(1);

        // Use generic presign with path
        const { uploadUrl, key } = await storageApi.presign.generic({
          filename: data.file.name,
          content_type: data.file.type,
          path: `precipitation/s2s/${data.s2s_id}/${formattedAddedTime}`,
        });

        onProgress?.(5);

        // Upload to S3
        await storageApi.uploadToS3(uploadUrl, data.file, (percent) => {
          const mappedPercent = 5 + (percent * 0.9);
          onProgress?.(mappedPercent);
        });

        // For precipitation, we still use the legacy endpoint as there's no commit endpoint
        // We just let the server know about the upload
        const result = await apiService.post<S2SFileRead>("/precipitation/s2s-files/", {
          s2s_id: data.s2s_id,
          file_path: key,
          added_time: data.added_time || new Date().toISOString(),
        });

        onProgress?.(100);

        return result;
      }
      else {
        return apiService.post<S2SFileRead>("/precipitation/s2s-files/", data);
      }
    },

    update: (s2sId: number, data: S2SFileUpdate) =>
      apiService.put<S2SFileRead>(`/precipitation/s2s-files/${s2sId}`, data),

    delete: (s2sId: number) =>
      apiService.delete(`/precipitation/s2s-files/${s2sId}`),
  },
};
