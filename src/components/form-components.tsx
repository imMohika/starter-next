import { useFieldContext, useFormContext } from "@/hooks/use-form-context";
import { Button } from "@/components/ui/button";
import { type ComponentProps, type ReactNode, useId } from "react";
import { useStore } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const FormSubscribeButton = ({ children }: { children: ReactNode }) => {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
			{([isSubmitting, canSubmit]) => (
				<Button type="submit" disabled={!canSubmit || isSubmitting}>
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
					key={typeof error === "string" ? error : error.message}
					className="mt-1 font-bold text-red-500"
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
			data-slot="form-label"
			data-error={errors && errors.length > 0}
			className={cn("data-[error=true]:text-destructive", className)}
			{...props}
		/>
	);
};

const FormDescription = ({ className, ...props }: ComponentProps<"p">) => {
	return (
		<p
			data-slot="form-description"
			className={cn("text-muted-foreground text-sm", className)}
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
				value={field.state.value}
				placeholder={placeholder}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>

			{description && <FormDescription>{description}</FormDescription>}
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}
