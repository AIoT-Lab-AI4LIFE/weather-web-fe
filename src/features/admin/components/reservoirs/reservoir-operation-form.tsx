import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ReservoirOperationCreate } from "@/types/reservoirs";

interface ReservoirOperationFormFieldsProps {
  form: UseFormReturn<ReservoirOperationCreate>;
}

export function ReservoirOperationFormFields({ form }: ReservoirOperationFormFieldsProps) {
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
        name="timestamp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timestamp *</FormLabel>
            <FormControl>
              <Input {...field} type="datetime-local" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="water_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Water Level (m)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Water Level"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="inflow"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inflow (m³/s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Inflow"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="total_discharge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Discharge (m³/s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Total Discharge"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="turbine_discharge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Turbine Discharge (m³/s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Turbine Discharge"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="spillway_discharge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spillway Discharge (m³/s)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Spillway Discharge"
                onChange={e => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="num_bottom_gates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bottom Gates</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Number of Bottom Gates"
                onChange={e => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="num_surface_gates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Surface Gates</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                placeholder="Number of Surface Gates"
                onChange={e => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
