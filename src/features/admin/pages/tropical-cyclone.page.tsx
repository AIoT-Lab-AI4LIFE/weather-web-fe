import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import Icon from "@mdi/react";
import { mdiDatabaseArrowRightOutline } from "@mdi/js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { FormModal } from "@/components/shared/form-modal";
import { handleApiError } from "@/lib/error-handle";
import { stormsApi } from "@/services/apis/storms.api";
import {
  BestTrackFileRead,
  BestTrackFileUpdate,
  HRESDataRead,
  HRESDataCreate,
  HRESDataUpdate,
  NWPDataRead,
  NWPDataCreate,
  NWPDataUpdate,
  StormCreate,
  StormRead,
  StormUpdate,
  BestTrackFileUpload,
} from "@/types/storms";
import { useCrudTable } from "../hooks/use-crud-table";
import { StormFormFields } from "../components/storms/storm-form";
import { BestTrackFileFormFields } from "../components/storms/best-track-file-form";
import { NWPDataFormFields } from "../components/storms/nwp-data-form";
import { HRESDataFormFields } from "../components/storms/hres-data-form";
import { stormColumns, bestTrackColumns, nwpColumns, hresColumns } from "../config/storms-columns";
import { stormSchema, bestTrackSchema, nwpDataSchema, hresDataSchema } from "../config/storms-schemas";

export function TropicalCyclonePage() {
  const [activeTab, setActiveTab] = useState("storms");
  const queryClient = useQueryClient();

  // Storms CRUD
  const storms = useCrudTable<StormRead, StormCreate, StormUpdate>({
    queryKey: "storms",
    listFn: stormsApi.storms.list,
    createFn: stormsApi.storms.create,
    updateFn: stormsApi.storms.update,
    deleteFn: stormsApi.storms.delete,
    entityName: "Storm",
    getItemId: item => item.storm_id,
  });

  const stormForm = useForm<StormCreate>({
    resolver: zodResolver(stormSchema),
    defaultValues: {
      storm_name: "",
      storm_id: 0,
    },
  });

  // Best Track Files CRUD
  const bestTrack = useCrudTable<BestTrackFileRead, BestTrackFileUpload, BestTrackFileUpdate>({
    queryKey: "besttrack-files",
    listFn: stormsApi.bestTrackFiles.list,
    createFn: stormsApi.bestTrackFiles.create,
    updateFn: (id: string, data: BestTrackFileUpdate) => stormsApi.bestTrackFiles.update(id, data),
    deleteFn: stormsApi.bestTrackFiles.delete,
    entityName: "BestTrack file",
    getItemId: item => item.id || "",
  });

  const bestTrackForm = useForm<BestTrackFileUpload>({
    resolver: zodResolver(bestTrackSchema),
    defaultValues: {
      storm_id: 0,
      issued_time: "",
      file_name: "",
      file: undefined,
    },
  });

  // NWP Data CRUD
  const nwp = useCrudTable<NWPDataRead, NWPDataCreate, NWPDataUpdate>({
    queryKey: "nwp-data",
    listFn: stormsApi.nwpData.list,
    createFn: stormsApi.nwpData.create,
    updateFn: (id: string, data: NWPDataUpdate) => stormsApi.nwpData.update(id, data),
    deleteFn: stormsApi.nwpData.delete,
    entityName: "NWP data",
    getItemId: item => item.id || "",
  });

  const nwpForm = useForm<NWPDataCreate & { file?: File }>({
    resolver: zodResolver(nwpDataSchema),
    defaultValues: {
      storm_id: 0,
      nwp_path: "",
      file: undefined,
      issued_time: "",
    },
  });

  // HRES Data CRUD
  const hres = useCrudTable<HRESDataRead, HRESDataCreate, HRESDataUpdate>({
    queryKey: "hres-data",
    listFn: stormsApi.hresData.list,
    createFn: stormsApi.hresData.create,
    updateFn: (id: string, data: HRESDataUpdate) => stormsApi.hresData.update(id, data),
    deleteFn: stormsApi.hresData.delete,
    entityName: "HRES data",
    getItemId: item => item.id || "",
  });

  const hresForm = useForm<HRESDataCreate & { file?: File }>({
    resolver: zodResolver(hresDataSchema),
    defaultValues: {
      storm_id: 0,
      hres_path: "",
      file: undefined,
      issued_time: "",
    },
  });

  // Run Storm Mutation
  const runStormMutation = useMutation({
    mutationFn: stormsApi.runStorm.run,
    onSuccess: () => {
      notification.success({ message: "Storm pipeline run successfully" });
      queryClient.invalidateQueries({ queryKey: ["storms"] });
    },
    onError: error => handleApiError(error, { customMessage: "Failed to run storm" }),
  });

  // Handle errors
  useEffect(() => {
    if (storms.query.isError) {
      handleApiError(storms.query.error, { customMessage: "Failed to load storms" });
    }
    if (bestTrack.query.isError) {
      handleApiError(bestTrack.query.error, { customMessage: "Failed to load best track files" });
    }
    if (nwp.query.isError) {
      handleApiError(nwp.query.error, { customMessage: "Failed to load NWP data" });
    }
    if (hres.query.isError) {
      handleApiError(hres.query.error, { customMessage: "Failed to load HRES data" });
    }
  }, [storms.query.isError, storms.query.error, bestTrack.query.isError, bestTrack.query.error, nwp.query.isError, nwp.query.error, hres.query.isError, hres.query.error]);

  // Reset forms when editing
  useEffect(() => {
    if (storms.editingItem) {
      stormForm.reset(storms.editingItem);
    }
    else {
      stormForm.reset();
    }
  }, [storms.editingItem, stormForm]);

  useEffect(() => {
    if (bestTrack.editingItem) {
      bestTrackForm.reset(bestTrack.editingItem);
    }
    else {
      bestTrackForm.reset();
    }
  }, [bestTrack.editingItem, bestTrackForm]);

  useEffect(() => {
    if (nwp.editingItem) {
      nwpForm.reset(nwp.editingItem);
    }
    else {
      nwpForm.reset();
    }
  }, [nwp.editingItem, nwpForm]);

  useEffect(() => {
    if (hres.editingItem) {
      hresForm.reset(hres.editingItem);
    }
    else {
      hresForm.reset();
    }
  }, [hres.editingItem, hresForm]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="storms">Storms</TabsTrigger>
          <TabsTrigger value="besttrack">Best Track</TabsTrigger>
          <TabsTrigger value="nwp">NWP Data</TabsTrigger>
          <TabsTrigger value="hres">HRES Data</TabsTrigger>
        </TabsList>

        <TabsContent value="storms" className="mt-6">
          <DataTable
            data={storms.tableData}
            columns={stormColumns}
            tableState={storms.state}
            tableInput={storms.input}
            onTableStateChange={changes => storms.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={storms.setInput}
            onAdd={storms.handleAdd}
            onEdit={storms.handleEdit}
            onDelete={storms.handleDelete}
            addLabel="Add Storm"
            emptyMessage="No storms found"
            showSearch={true}
            isLoading={storms.query.isLoading}
            getItemId={storm => storm.storm_id.toString()}
            actions={[{
              label: "Run",
              icon: <Icon path={mdiDatabaseArrowRightOutline} size={1} className="text-main" />,
              onClick: storm => runStormMutation.mutate(storm.storm_id),
            }]}
          />
        </TabsContent>

        <TabsContent value="besttrack" className="mt-6">
          <DataTable
            data={bestTrack.tableData}
            columns={bestTrackColumns}
            tableState={bestTrack.state}
            tableInput={bestTrack.input}
            onTableStateChange={changes => bestTrack.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={bestTrack.setInput}
            onAdd={bestTrack.handleAdd}
            onEdit={bestTrack.handleEdit}
            onDelete={bestTrack.handleDelete}
            addLabel="Add BestTrack File"
            emptyMessage="No best track files found"
            showSearch={true}
            isLoading={bestTrack.query.isLoading}
            getItemId={file => file.id || ""}
          />
        </TabsContent>

        <TabsContent value="nwp" className="mt-6">
          <DataTable
            data={nwp.tableData}
            columns={nwpColumns}
            tableState={nwp.state}
            tableInput={nwp.input}
            onTableStateChange={changes => nwp.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={nwp.setInput}
            onAdd={nwp.handleAdd}
            onEdit={nwp.handleEdit}
            onDelete={nwp.handleDelete}
            addLabel="Add NWP Data"
            emptyMessage="No NWP data found"
            showSearch={true}
            isLoading={nwp.query.isLoading}
            getItemId={data => data.id || ""}
          />
        </TabsContent>

        <TabsContent value="hres" className="mt-6">
          <DataTable
            data={hres.tableData}
            columns={hresColumns}
            tableState={hres.state}
            tableInput={hres.input}
            onTableStateChange={changes => hres.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={hres.setInput}
            onAdd={hres.handleAdd}
            onEdit={hres.handleEdit}
            onDelete={hres.handleDelete}
            addLabel="Add HRES Data"
            emptyMessage="No HRES data found"
            showSearch={true}
            isLoading={hres.query.isLoading}
            getItemId={data => data.id || ""}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <FormModal
        open={storms.modalOpen}
        onOpenChange={storms.setModalOpen}
        title={storms.editingItem ? "Edit Storm" : "Add Storm"}
        form={stormForm}
        onSubmit={storms.handleSubmit}
        isLoading={storms.createMutation.isPending || storms.updateMutation.isPending}
      >
        <StormFormFields form={stormForm} />
      </FormModal>

      <FormModal
        open={bestTrack.modalOpen}
        onOpenChange={bestTrack.setModalOpen}
        title={bestTrack.editingItem ? "Edit BestTrack File" : "Add BestTrack File"}
        form={bestTrackForm}
        onSubmit={bestTrack.handleSubmit}
        isLoading={bestTrack.createMutation.isPending || bestTrack.updateMutation.isPending}
        uploadProgress={bestTrack.uploadProgress}
      >
        <BestTrackFileFormFields form={bestTrackForm} />
      </FormModal>

      <FormModal
        open={nwp.modalOpen}
        onOpenChange={nwp.setModalOpen}
        title={nwp.editingItem ? "Edit NWP Data" : "Add NWP Data"}
        form={nwpForm}
        onSubmit={nwp.handleSubmit}
        isLoading={nwp.createMutation.isPending || nwp.updateMutation.isPending}
        uploadProgress={nwp.uploadProgress}
      >
        <NWPDataFormFields form={nwpForm} />
      </FormModal>

      <FormModal
        open={hres.modalOpen}
        onOpenChange={hres.setModalOpen}
        title={hres.editingItem ? "Edit HRES Data" : "Add HRES Data"}
        form={hresForm}
        onSubmit={hres.handleSubmit}
        isLoading={hres.createMutation.isPending || hres.updateMutation.isPending}
        uploadProgress={hres.uploadProgress}
      >
        <HRESDataFormFields form={hresForm} />
      </FormModal>
    </div>
  );
}
