import { TableColumn } from "@/components/shared/data-table";
import { StormRead, BestTrackFileRead, NWPDataRead, HRESDataRead } from "@/types/storms";

export const stormColumns: TableColumn<StormRead>[] = [
  { key: "storm_name", header: "Name" },
  { key: "storm_id", header: "Storm ID" },
  {
    key: "created_at",
    header: "Created",
    render: value => value ? new Date(value).toLocaleDateString() : "N/A",
  },
];

export const bestTrackColumns: TableColumn<BestTrackFileRead>[] = [
  { key: "file_name", header: "File Name" },
  { key: "storm_id", header: "Storm ID" },
  { key: "issued_time", header: "Issued Time" },
  {
    key: "created_at",
    header: "Created",
    render: value => value ? new Date(value).toLocaleDateString() : "N/A",
  },
];

export const nwpColumns: TableColumn<NWPDataRead>[] = [
  { key: "nwp_path", header: "NWP Path" },
  { key: "storm_id", header: "Storm ID" },
  { key: "issued_time", header: "Issued Time" },
  {
    key: "created_at",
    header: "Created",
    render: value => value ? new Date(value).toLocaleDateString() : "N/A",
  },
];

export const hresColumns: TableColumn<HRESDataRead>[] = [
  { key: "hres_path", header: "HRES Path" },
  { key: "storm_id", header: "Storm ID" },
  { key: "issued_time", header: "Issued Time" },
  {
    key: "created_at",
    header: "Created",
    render: value => value ? new Date(value).toLocaleDateString() : "N/A",
  },
];
