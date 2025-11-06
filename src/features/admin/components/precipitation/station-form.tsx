import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StationCreate } from "@/types/precipitation";

interface StationFormFieldsProps {
  form: UseFormReturn<StationCreate>;
}

export function StationFormFields({ form }: StationFormFieldsProps) {
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
        name="station_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Station Name *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Station name" />
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
        name="latitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Latitude</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Latitude"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="longitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Longitude</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Longitude"
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
            <FormLabel>Elevation</FormLabel>
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
