"use client";

import { z } from "zod";
import { useAppForm } from "@/hooks/use-form";
import { clientLogger } from "@/lib/logger/logger.client";

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
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit().catch(clientLogger.error);
      }}
    >
      <form.AppField name="name">
        {(field) => (
          <field.TextInput
            description="Please enter your username"
            label="Username"
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
