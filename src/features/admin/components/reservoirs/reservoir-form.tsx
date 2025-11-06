import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ReservoirCreate } from "@/types/reservoirs";

interface ReservoirFormFieldsProps {
  form: UseFormReturn<ReservoirCreate>;
}

export function ReservoirFormFields({ form }: ReservoirFormFieldsProps) {
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
        name="reservoir_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reservoir Name *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Reservoir name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="river"
        render={({ field }) => (
          <FormItem>
            <FormLabel>River</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} placeholder="River" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Province</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} placeholder="Province" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Capacity"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="elevation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Elevation (m)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Elevation"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
