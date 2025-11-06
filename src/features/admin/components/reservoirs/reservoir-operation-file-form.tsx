import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { UseFormReturn } from "react-hook-form";
import { ReservoirOperationFileUpload } from "@/types/reservoirs";

interface ReservoirOperationFileFormFieldsProps {
  form: UseFormReturn<ReservoirOperationFileUpload>;
}

export function ReservoirOperationFileFormFields({ form }: ReservoirOperationFileFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="reservoir_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reservoir ID *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                placeholder="Reservoir ID"
                onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel>File</FormLabel>
            <FormControl>
              <FileUpload
                onChange={file => field.onChange(file)}
                acceptedFileTypes=".csv,.txt"
                currentFileName={field.value?.name}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="from_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>From Time *</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="to_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>To Time *</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="added_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Added Time</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="updated_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Updated Time</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
