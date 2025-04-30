"use client";

import { z } from "zod";
import { useAppForm } from "@/hooks/use-form";
import { useCreateUser } from "@/hooks/use-users";

const schema = z.object({
	username: z.string().min(1, "Username is missing"),
});

export const AddUserForm = () => {
	const { mutateAsync } = useCreateUser();
	const form = useAppForm({
		defaultValues: {
			username: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: async ({ value: { username }, formApi }) => {
			await mutateAsync({ username });
			formApi.reset();
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
			<form.AppField name="username">
				{(field) => <field.TextInput label="Username" />}
			</form.AppField>

			<div className="flex justify-end">
				<form.AppForm>
					<form.SubscribeButton>Create</form.SubscribeButton>
				</form.AppForm>
			</div>
		</form>
	);
};
