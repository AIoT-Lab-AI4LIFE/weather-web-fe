import { z } from "zod";

export const reservoirSchema = z.object({
  reservoir_id: z.number().min(0, "Reservoir ID is required"),
  reservoir_name: z.string().min(1, "Reservoir name is required"),
  river: z.string().nullable(),
  province: z.string().nullable(),
  capacity: z.number().min(0, "Capacity must be non-negative").nullable(),
  elevation: z.number().min(0, "Elevation must be non-negative").nullable(),
});

export const operationSchema = z.object({
  reservoir_id: z.number().min(0, "Reservoir ID is required"),
  timestamp: z.string().min(1, "Timestamp is required"),
  water_level: z.number().min(0, "Water level must be non-negative").nullable(),
  inflow: z.number().min(0, "Inflow must be non-negative").nullable(),
  total_discharge: z.number().min(0, "Total discharge must be non-negative").nullable(),
  turbine_discharge: z.number().min(0, "Turbine discharge must be non-negative").nullable(),
  spillway_discharge: z.number().min(0, "Spillway discharge must be non-negative").nullable(),
  num_bottom_gates: z.number().min(0, "Number of bottom gates must be non-negative").nullable(),
  num_surface_gates: z.number().min(0, "Number of surface gates must be non-negative").nullable(),
});

export const operationFileSchema = z.object({
  reservoir_id: z.number().min(0, "Reservoir ID is required"),
  file_path: z.string().optional(),
  file: z.instanceof(File).optional(),
  from_time: z.string().min(1, "From time is required"),
  to_time: z.string().min(1, "To time is required"),
  added_time: z.string().nullable(),
  updated_time: z.string().nullable(),
});
