import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RainfallRecordCreate } from "@/types/precipitation";

interface RainfallRecordFormFieldsProps {
  form: UseFormReturn<RainfallRecordCreate>;
}

export function RainfallRecordFormFields({ form }: RainfallRecordFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="station_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Station ID *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                placeholder="Station ID"
                onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="start_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time *</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="end_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time *</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="accumulated_rainfall"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accumulated Rainfall (mm) *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                placeholder="Accumulated Rainfall"
                onChange={e => field.onChange(Number.parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="data_source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Source *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Data Source" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
