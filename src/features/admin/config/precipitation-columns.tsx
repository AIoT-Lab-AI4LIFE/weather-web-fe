import { TableColumn } from "@/components/shared/data-table";
import { StationRead, RainfallRecordRead, S2SFileRead } from "@/types/precipitation";

export const stationColumns: TableColumn<StationRead>[] = [
  { key: "station_name", header: "Station Name" },
  { key: "province", header: "Province" },
  { key: "latitude", header: "Latitude" },
  { key: "longitude", header: "Longitude" },
  { key: "elevation", header: "Elevation (m)" },
  {
    key: "created_at",
    header: "Created",
    render: value => value ? new Date(value).toLocaleDateString() : "N/A",
  },
];

export const rainfallRecordColumns: TableColumn<RainfallRecordRead>[] = [
  { key: "station_id", header: "Station ID" },
  {
    key: "start_time",
    header: "Start Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    key: "end_time",
    header: "End Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
  { key: "accumulated_rainfall", header: "Accumulated Rainfall (mm)" },
  { key: "data_source", header: "Data Source" },
];

export const s2sFileColumns: TableColumn<S2SFileRead>[] = [
  { key: "s2s_id", header: "S2S ID" },
  { key: "file_path", header: "File Path" },
  {
    key: "added_time",
    header: "Added Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    key: "updated_time",
    header: "Updated Time",
    render: value => value ? new Date(value).toLocaleString() : "N/A",
  },
];
