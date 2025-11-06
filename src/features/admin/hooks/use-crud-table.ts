import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { handleApiError } from "@/lib/error-handle";
import { TableState } from "@/components/shared/data-table";

interface CrudTableConfig<TRead, TCreate, TUpdate> {
  queryKey: string;
  listFn: (params: { page: number; limit: number; search: string }) => Promise<any>;
  createFn: (data: TCreate, onProgress?: (progress: number) => void) => Promise<any>;
  updateFn: (id: any, data: TUpdate) => Promise<any>;
  deleteFn: (id: any) => Promise<any>;
  entityName: string;
  getItemId: (item: TRead) => any;
}

export function useCrudTable<TRead, TCreate = TRead, TUpdate = Partial<TCreate>>({
  queryKey,
  listFn,
  createFn,
  updateFn,
  deleteFn,
  entityName,
  getItemId,
}: CrudTableConfig<TRead, TCreate, TUpdate>) {
  const queryClient = useQueryClient();

  const [state, setState] = useState<TableState>({
    itemsPerPage: 10,
    page: 1,
    search: "",
  });
  const [input, setInput] = useState({ search: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TRead | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const query = useQuery({
    queryKey: [queryKey, state],
    queryFn: () => listFn({
      page: state.page,
      limit: state.itemsPerPage,
      search: state.search,
    }),
  });

  const createMutation = useMutation({
    mutationFn: (data: TCreate) => createFn(data, setUploadProgress),
    onSuccess: () => {
      notification.success({ message: `${entityName} created successfully` });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setModalOpen(false);
      setUploadProgress(0);
    },
    onError: (error) => {
      handleApiError(error, { customMessage: `Failed to create ${entityName}` });
      setUploadProgress(0);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: any; data: TUpdate }) => updateFn(id, data),
    onSuccess: () => {
      notification.success({ message: `${entityName} updated successfully` });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setModalOpen(false);
    },
    onError: error => handleApiError(error, { customMessage: `Failed to update ${entityName}` }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      notification.success({ message: `${entityName} deleted successfully` });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: error => handleApiError(error, { customMessage: `Failed to delete ${entityName}` }),
  });

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: TRead) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (item: TRead) => {
    deleteMutation.mutate(getItemId(item));
  };

  const handleSubmit = async (data: TCreate | TUpdate) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: getItemId(editingItem), data: data as TUpdate });
    }
    else {
      await createMutation.mutateAsync(data as TCreate);
    }
  };

  const tableData = {
    rows: query.data?.data || [],
    currentPage: query.data?.meta.page || 1,
    totalItems: query.data?.meta.total || 0,
    totalPages: query.data?.meta.totalPages || 1,
  };

  return {
    state,
    setState,
    input,
    setInput,
    modalOpen,
    setModalOpen,
    editingItem,
    query,
    createMutation,
    updateMutation,
    deleteMutation,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    tableData,
    uploadProgress,
  };
}
