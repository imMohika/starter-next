import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/hooks/use-form-context";
import {
	FormSubscribeButton,
	FormTextInput,
} from "@/components/form-components";

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextInput: FormTextInput,
	},
	formComponents: {
		SubscribeButton: FormSubscribeButton,
	},
	fieldContext,
	formContext,
});
