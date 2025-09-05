import { useStore } from "@tanstack/react-form";
import { type ComponentProps, type ReactNode, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext, useFormContext } from "@/hooks/use-form-context";
import { cn } from "@/lib/utils";

export const FormSubscribeButton = ({ children }: { children: ReactNode }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button disabled={!canSubmit || isSubmitting} type="submit">
          {isSubmitting ? "..." : children}
        </Button>
      )}
    </form.Subscribe>
  );
};

const ErrorMessages = ({
  errors,
}: {
  errors: Array<string | { message: string }>;
}) => {
  return (
    <>
      {errors.map((error) => (
        <div
          className="mt-1 font-bold text-red-500"
          key={typeof error === "string" ? error : error.message}
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  );
};

const FormLabel = ({ className, ...props }: ComponentProps<typeof Label>) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <Label
      className={cn("data-[error=true]:text-destructive", className)}
      data-error={errors && errors.length > 0}
      data-slot="form-label"
      {...props}
    />
  );
};

const FormDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="form-description"
      {...props}
    />
  );
};

export function FormTextInput({
  label,
  description,
  placeholder,
}: {
  label?: string;
  description?: string;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const itemId = useId();

  return (
    <div>
      {label && <FormLabel htmlFor={itemId}>{label}</FormLabel>}

      <Input
        id={itemId}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        value={field.state.value}
      />

      {description && <FormDescription>{description}</FormDescription>}
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
