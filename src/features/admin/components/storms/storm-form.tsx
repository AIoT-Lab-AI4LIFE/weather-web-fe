import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StormCreate } from "@/types/storms";

interface StormFormFieldsProps {
  form: UseFormReturn<StormCreate>;
}

export function StormFormFields({ form }: StormFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="storm_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Storm Name *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Storm name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
    </>
  );
}
