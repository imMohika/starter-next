import { createFormHook } from "@tanstack/react-form";
import {
  FormSubscribeButton,
  FormTextInput,
} from "@/components/form-components";
import { fieldContext, formContext } from "@/hooks/use-form-context";

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
