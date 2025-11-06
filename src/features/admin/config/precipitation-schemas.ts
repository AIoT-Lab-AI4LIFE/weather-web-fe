import { z } from "zod";

export const stationSchema = z.object({
  station_id: z.number().min(0, "Station ID is required"),
  station_name: z.string().min(1, "Station name is required"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90").nullable(),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180").nullable(),
  elevation: z.number().min(0, "Elevation must be non-negative").nullable(),
  province: z.string().nullable(),
});

export const rainfallRecordSchema = z.object({
  station_id: z.number().min(0, "Station ID is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  accumulated_rainfall: z.number().min(0, "Accumulated rainfall must be non-negative"),
  data_source: z.string().min(1, "Data source is required"),
});

export const s2sFileSchema = z.object({
  s2s_id: z.number().min(0, "S2S ID is required"),
  file_path: z.string().optional(),
  file: z.instanceof(File).optional(),
  added_time: z.string().nullable(),
  updated_time: z.string().nullable(),
});
