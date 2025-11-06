import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { UseFormReturn } from "react-hook-form";
import { NWPDataCreate } from "@/types/storms";

interface NWPDataFormFieldsProps {
  form: UseFormReturn<NWPDataCreate & { file?: File }>;
}

export function NWPDataFormFields({ form }: NWPDataFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="storm_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Storm ID *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                placeholder="Storm ID"
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
            <FormLabel>File *</FormLabel>
            <FormControl>
              <FileUpload
                onChange={file => field.onChange(file)}
                acceptedFileTypes=".nc,.grib"
                currentFileName={field.value?.name}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="issued_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issued Time *</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
