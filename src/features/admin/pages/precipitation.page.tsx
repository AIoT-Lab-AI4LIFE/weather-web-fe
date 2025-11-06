import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { FormModal } from "@/components/shared/form-modal";
import { handleApiError } from "@/lib/error-handle";
import { precipitationApi } from "@/services/apis/precipitation.api";
import {
  StationRead,
  StationCreate,
  StationUpdate,
  RainfallRecordRead,
  RainfallRecordCreate,
  RainfallRecordUpdate,
  S2SFileRead,
  S2SFileUpdate,
  S2SFileUpload,
} from "@/types/precipitation";
import { useCrudTable } from "../hooks/use-crud-table";
import { StationFormFields } from "../components/precipitation/station-form";
import { RainfallRecordFormFields } from "../components/precipitation/rainfall-record-form";
import { S2SFileFormFields } from "../components/precipitation/s2s-file-form";
import { stationColumns, rainfallRecordColumns, s2sFileColumns } from "../config/precipitation-columns";
import { stationSchema, rainfallRecordSchema, s2sFileSchema } from "../config/precipitation-schemas";

export function PrecipitationPage() {
  const [activeTab, setActiveTab] = useState("stations");

  // Stations CRUD
  const stations = useCrudTable<StationRead, StationCreate, StationUpdate>({
    queryKey: "stations",
    listFn: precipitationApi.stations.list,
    createFn: precipitationApi.stations.create,
    updateFn: precipitationApi.stations.update,
    deleteFn: precipitationApi.stations.delete,
    entityName: "Station",
    getItemId: item => item.station_id,
  });

  const stationForm = useForm<StationCreate>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      station_id: 0,
      station_name: "",
      latitude: null,
      longitude: null,
      elevation: null,
      province: null,
    },
  });

  // Rainfall Records CRUD
  const records = useCrudTable<RainfallRecordRead, RainfallRecordCreate, RainfallRecordUpdate>({
    queryKey: "rainfall-records",
    listFn: precipitationApi.rainfallRecords.list,
    createFn: precipitationApi.rainfallRecords.create,
    updateFn: precipitationApi.rainfallRecords.update,
    deleteFn: precipitationApi.rainfallRecords.delete,
    entityName: "Rainfall record",
    getItemId: item => item.station_id,
  });

  const recordForm = useForm<RainfallRecordCreate>({
    resolver: zodResolver(rainfallRecordSchema),
    defaultValues: {
      station_id: 0,
      start_time: "",
      end_time: "",
      accumulated_rainfall: 0,
      data_source: "",
    },
  });

  // S2S Files CRUD
  const files = useCrudTable<S2SFileRead, S2SFileUpload, S2SFileUpdate>({
    queryKey: "s2s-files",
    listFn: precipitationApi.s2sFiles.list,
    createFn: precipitationApi.s2sFiles.create,
    updateFn: precipitationApi.s2sFiles.update,
    deleteFn: precipitationApi.s2sFiles.delete,
    entityName: "S2S file",
    getItemId: item => item.s2s_id,
  });

  const fileForm = useForm<S2SFileUpload>({
    resolver: zodResolver(s2sFileSchema),
    defaultValues: {
      s2s_id: 0,
      file_path: "",
      file: undefined,
      added_time: null,
      updated_time: null,
    },
  });

  // Handle errors
  useEffect(() => {
    if (stations.query.isError) {
      handleApiError(stations.query.error, { customMessage: "Failed to load stations" });
    }
    if (records.query.isError) {
      handleApiError(records.query.error, { customMessage: "Failed to load rainfall records" });
    }
    if (files.query.isError) {
      handleApiError(files.query.error, { customMessage: "Failed to load S2S files" });
    }
  }, [stations.query.isError, stations.query.error, records.query.isError, records.query.error, files.query.isError, files.query.error]);

  // Reset forms when editing
  useEffect(() => {
    if (stations.editingItem) {
      stationForm.reset(stations.editingItem);
    }
    else {
      stationForm.reset();
    }
  }, [stations.editingItem, stationForm]);

  useEffect(() => {
    if (records.editingItem) {
      recordForm.reset(records.editingItem);
    }
    else {
      recordForm.reset();
    }
  }, [records.editingItem, recordForm]);

  useEffect(() => {
    if (files.editingItem) {
      fileForm.reset(files.editingItem);
    }
    else {
      fileForm.reset();
    }
  }, [files.editingItem, fileForm]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="records">Rainfall Records</TabsTrigger>
          <TabsTrigger value="files">S2S Files</TabsTrigger>
        </TabsList>

        <TabsContent value="stations" className="mt-6">
          <DataTable
            data={stations.tableData}
            columns={stationColumns}
            tableState={stations.state}
            tableInput={stations.input}
            onTableStateChange={changes => stations.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={stations.setInput}
            onAdd={stations.handleAdd}
            onEdit={stations.handleEdit}
            onDelete={stations.handleDelete}
            addLabel="Add Station"
            emptyMessage="No stations found"
            showSearch={true}
            isLoading={stations.query.isLoading}
            getItemId={station => station.station_id.toString()}
          />
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <DataTable
            data={records.tableData}
            columns={rainfallRecordColumns}
            tableState={records.state}
            tableInput={records.input}
            onTableStateChange={changes => records.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={records.setInput}
            onAdd={records.handleAdd}
            onEdit={records.handleEdit}
            onDelete={records.handleDelete}
            addLabel="Add Record"
            emptyMessage="No rainfall records found"
            showSearch={true}
            isLoading={records.query.isLoading}
            getItemId={record => record.station_id.toString()}
          />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <DataTable
            data={files.tableData}
            columns={s2sFileColumns}
            tableState={files.state}
            tableInput={files.input}
            onTableStateChange={changes => files.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={files.setInput}
            onAdd={files.handleAdd}
            onEdit={files.handleEdit}
            onDelete={files.handleDelete}
            addLabel="Add File"
            emptyMessage="No S2S files found"
            showSearch={true}
            isLoading={files.query.isLoading}
            getItemId={file => file.s2s_id.toString()}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <FormModal
        open={stations.modalOpen}
        onOpenChange={stations.setModalOpen}
        title={stations.editingItem ? "Edit Station" : "Add Station"}
        form={stationForm}
        onSubmit={stations.handleSubmit}
        isLoading={stations.createMutation.isPending || stations.updateMutation.isPending}
      >
        <StationFormFields form={stationForm} />
      </FormModal>

      <FormModal
        open={records.modalOpen}
        onOpenChange={records.setModalOpen}
        title={records.editingItem ? "Edit Rainfall Record" : "Add Rainfall Record"}
        form={recordForm}
        onSubmit={records.handleSubmit}
        isLoading={records.createMutation.isPending || records.updateMutation.isPending}
      >
        <RainfallRecordFormFields form={recordForm} />
      </FormModal>

      <FormModal
        open={files.modalOpen}
        onOpenChange={files.setModalOpen}
        title={files.editingItem ? "Edit S2S File" : "Add S2S File"}
        form={fileForm}
        onSubmit={files.handleSubmit}
        isLoading={files.createMutation.isPending || files.updateMutation.isPending}
        uploadProgress={files.uploadProgress}
      >
        <S2SFileFormFields form={fileForm} />
      </FormModal>
    </div>
  );
}
