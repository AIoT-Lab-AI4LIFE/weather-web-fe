import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { UseFormReturn } from "react-hook-form";
import { S2SFileUpload } from "@/types/precipitation";

interface S2SFileFormFieldsProps {
  form: UseFormReturn<S2SFileUpload>;
}

export function S2SFileFormFields({ form }: S2SFileFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="s2s_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>S2S ID *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                placeholder="S2S ID"
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
