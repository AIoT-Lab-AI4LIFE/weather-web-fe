import { z } from "zod";

export const stormSchema = z.object({
  storm_name: z.string().min(1, "Name is required"),
  storm_id: z.number().min(0, "Storm ID is required"),
});

export const bestTrackSchema = z.object({
  storm_id: z.number().min(0, "Storm ID is required"),
  issued_time: z.string().min(1, "Issued time is required"),
  file_name: z.string().optional(),
  file: z.instanceof(File).optional(),
});

export const nwpDataSchema = z.object({
  storm_id: z.number().min(0, "Storm ID is required"),
  nwp_path: z.string().min(1, "File is required"),
  file: z.instanceof(File).optional(),
  issued_time: z.string().min(1, "Issued time is required"),
});

export const hresDataSchema = z.object({
  storm_id: z.number().min(0, "Storm ID is required"),
  hres_path: z.string().min(1, "File is required"),
  file: z.instanceof(File).optional(),
  issued_time: z.string().min(1, "Issued time is required"),
});
