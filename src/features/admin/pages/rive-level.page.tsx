import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { FormModal } from "@/components/shared/form-modal";
import { handleApiError } from "@/lib/error-handle";
import { reservoirsApi } from "@/services/apis/reservoirs.api";
import {
  ReservoirRead,
  ReservoirCreate,
  ReservoirUpdate,
  ReservoirOperationRead,
  ReservoirOperationCreate,
  ReservoirOperationUpdate,
  ReservoirOperationFileRead,
  ReservoirOperationFileUpdate,
  ReservoirOperationFileUpload,
} from "@/types/reservoirs";
import { useCrudTable } from "../hooks/use-crud-table";
import { ReservoirFormFields } from "../components/reservoirs/reservoir-form";
import { ReservoirOperationFormFields } from "../components/reservoirs/reservoir-operation-form";
import { ReservoirOperationFileFormFields } from "../components/reservoirs/reservoir-operation-file-form";
import { reservoirColumns, operationColumns, fileColumns } from "../config/reservoirs-columns";
import { reservoirSchema, operationSchema, operationFileSchema } from "../config/reservoirs-schemas";

export function RiveLevelPage() {
  const [activeTab, setActiveTab] = useState("reservoirs");

  // Reservoirs CRUD
  const reservoirs = useCrudTable<ReservoirRead, ReservoirCreate, ReservoirUpdate>({
    queryKey: "reservoirs",
    listFn: reservoirsApi.reservoirs.list,
    createFn: reservoirsApi.reservoirs.create,
    updateFn: reservoirsApi.reservoirs.update,
    deleteFn: reservoirsApi.reservoirs.delete,
    entityName: "Reservoir",
    getItemId: item => item.reservoir_id,
  });

  const reservoirForm = useForm<ReservoirCreate>({
    resolver: zodResolver(reservoirSchema),
    defaultValues: {
      reservoir_id: 0,
      reservoir_name: "",
      river: null,
      province: null,
      capacity: null,
      elevation: null,
    },
  });

  // Operations CRUD
  const operations = useCrudTable<ReservoirOperationRead, ReservoirOperationCreate, ReservoirOperationUpdate>({
    queryKey: "reservoir-operations",
    listFn: reservoirsApi.operations.list,
    createFn: reservoirsApi.operations.create,
    updateFn: reservoirsApi.operations.update,
    deleteFn: reservoirsApi.operations.delete,
    entityName: "Operation",
    getItemId: item => item.reservoir_id,
  });

  const operationForm = useForm<ReservoirOperationCreate>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      reservoir_id: 0,
      timestamp: "",
      water_level: null,
      inflow: null,
      total_discharge: null,
      turbine_discharge: null,
      spillway_discharge: null,
      num_bottom_gates: null,
      num_surface_gates: null,
    },
  });

  // Files CRUD
  const files = useCrudTable<ReservoirOperationFileRead, ReservoirOperationFileUpload, ReservoirOperationFileUpdate>({
    queryKey: "reservoir-operation-files",
    listFn: reservoirsApi.operationFiles.list,
    createFn: reservoirsApi.operationFiles.create,
    updateFn: reservoirsApi.operationFiles.update,
    deleteFn: reservoirsApi.operationFiles.delete,
    entityName: "File",
    getItemId: item => item.reservoir_id,
  });

  const fileForm = useForm<ReservoirOperationFileUpload>({
    resolver: zodResolver(operationFileSchema),
    defaultValues: {
      reservoir_id: 0,
      file_path: "",
      file: undefined,
      from_time: "",
      to_time: "",
      added_time: null,
      updated_time: null,
    },
  });

  // Handle errors
  useEffect(() => {
    if (reservoirs.query.isError) {
      handleApiError(reservoirs.query.error, { customMessage: "Failed to load reservoirs" });
    }
    if (operations.query.isError) {
      handleApiError(operations.query.error, { customMessage: "Failed to load operations" });
    }
    if (files.query.isError) {
      handleApiError(files.query.error, { customMessage: "Failed to load operation files" });
    }
  }, [reservoirs.query.isError, reservoirs.query.error, operations.query.isError, operations.query.error, files.query.isError, files.query.error]);

  // Reset forms when editing
  useEffect(() => {
    if (reservoirs.editingItem) {
      reservoirForm.reset(reservoirs.editingItem);
    }
    else {
      reservoirForm.reset();
    }
  }, [reservoirs.editingItem, reservoirForm]);

  useEffect(() => {
    if (operations.editingItem) {
      operationForm.reset(operations.editingItem);
    }
    else {
      operationForm.reset();
    }
  }, [operations.editingItem, operationForm]);

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
          <TabsTrigger value="reservoirs">Reservoirs</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="reservoirs" className="mt-6">
          <DataTable
            data={reservoirs.tableData}
            columns={reservoirColumns}
            tableState={reservoirs.state}
            tableInput={reservoirs.input}
            onTableStateChange={changes => reservoirs.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={reservoirs.setInput}
            onAdd={reservoirs.handleAdd}
            onEdit={reservoirs.handleEdit}
            onDelete={reservoirs.handleDelete}
            addLabel="Add Reservoir"
            emptyMessage="No reservoirs found"
            showSearch={true}
            isLoading={reservoirs.query.isLoading}
            getItemId={reservoir => reservoir.reservoir_id.toString()}
          />
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <DataTable
            data={operations.tableData}
            columns={operationColumns}
            tableState={operations.state}
            tableInput={operations.input}
            onTableStateChange={changes => operations.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={operations.setInput}
            onAdd={operations.handleAdd}
            onEdit={operations.handleEdit}
            onDelete={operations.handleDelete}
            addLabel="Add Operation"
            emptyMessage="No operations found"
            showSearch={true}
            isLoading={operations.query.isLoading}
            getItemId={operation => operation.reservoir_id.toString()}
          />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <DataTable
            data={files.tableData}
            columns={fileColumns}
            tableState={files.state}
            tableInput={files.input}
            onTableStateChange={changes => files.setState(prev => ({ ...prev, ...changes }))}
            onTableInputChange={files.setInput}
            onAdd={files.handleAdd}
            onEdit={files.handleEdit}
            onDelete={files.handleDelete}
            addLabel="Add File"
            emptyMessage="No operation files found"
            showSearch={true}
            isLoading={files.query.isLoading}
            getItemId={file => file.reservoir_id.toString()}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <FormModal
        open={reservoirs.modalOpen}
        onOpenChange={reservoirs.setModalOpen}
        title={reservoirs.editingItem ? "Edit Reservoir" : "Add Reservoir"}
        form={reservoirForm}
        onSubmit={reservoirs.handleSubmit}
        isLoading={reservoirs.createMutation.isPending || reservoirs.updateMutation.isPending}
      >
        <ReservoirFormFields form={reservoirForm} />
      </FormModal>

      <FormModal
        open={operations.modalOpen}
        onOpenChange={operations.setModalOpen}
        title={operations.editingItem ? "Edit Operation" : "Add Operation"}
        form={operationForm}
        onSubmit={operations.handleSubmit}
        isLoading={operations.createMutation.isPending || operations.updateMutation.isPending}
      >
        <ReservoirOperationFormFields form={operationForm} />
      </FormModal>

      <FormModal
        open={files.modalOpen}
        onOpenChange={files.setModalOpen}
        title={files.editingItem ? "Edit File" : "Add File"}
        form={fileForm}
        onSubmit={files.handleSubmit}
        isLoading={files.createMutation.isPending || files.updateMutation.isPending}
        uploadProgress={files.uploadProgress}
      >
        <ReservoirOperationFileFormFields form={fileForm} />
      </FormModal>
    </div>
  );
}
