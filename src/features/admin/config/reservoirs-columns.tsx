import { TableColumn } from "@/components/shared/data-table";
import { ReservoirRead, ReservoirOperationRead, ReservoirOperationFileRead } from "@/types/reservoirs";

export const reservoirColumns: TableColumn<ReservoirRead>[] = [
  { key: "reservoir_name", header: "Reservoir Name" },
  { key: "river", header: "River" },
  { key: "province", header: "Province" },
  { key: "capacity", header: "Capacity" },
  { key: "elevation", header: "Elevation (m)" },
  {
    key: "created_at",
    header: "Created",
    render: value => value ? new Date(value).toLocaleDateString() : "N/A",
  },
];

export const operationColumns: TableColumn<ReservoirOperationRead>[] = [
  { key: "reservoir_id", header: "Reservoir ID" },
  {
    key: "timestamp",
    header: "Timestamp",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
  { key: "water_level", header: "Water Level (m)" },
  { key: "inflow", header: "Inflow (m³/s)" },
  { key: "total_discharge", header: "Total Discharge (m³/s)" },
  { key: "turbine_discharge", header: "Turbine Discharge (m³/s)" },
  { key: "spillway_discharge", header: "Spillway Discharge (m³/s)" },
  { key: "num_bottom_gates", header: "Bottom Gates" },
  { key: "num_surface_gates", header: "Surface Gates" },
];

export const fileColumns: TableColumn<ReservoirOperationFileRead>[] = [
  { key: "reservoir_id", header: "Reservoir ID" },
  { key: "file_path", header: "File Path" },
  {
    key: "from_time",
    header: "From Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    key: "to_time",
    header: "To Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    key: "added_time",
    header: "Added Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
];
