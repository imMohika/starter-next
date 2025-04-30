"use client";

import { z } from "zod";
import { useAppForm } from "@/hooks/use-form";

const schema = z.object({
	name: z.string().min(1, "Name is missing"),
});

export const SimpleForm = () => {
	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value: { name } }) => {
			alert(`Hello ${name}`);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit().catch(console.error);
			}}
			className="space-y-6"
		>
			<form.AppField name="name">
				{(field) => (
					<field.TextInput
						label="Username"
						description="Please enter your username"
						placeholder="john"
					/>
				)}
			</form.AppField>

			<div className="flex justify-end">
				<form.AppForm>
					<form.SubscribeButton>Submit</form.SubscribeButton>
				</form.AppForm>
			</div>
		</form>
	);
};
