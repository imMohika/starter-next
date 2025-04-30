import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

const usersDataSchema = z.array(
	z.object({
		username: z.string(),
		created_at: z.coerce.date(),
	}),
);

export const useUsers = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const data = await ky.get("/api/users").json();
			return usersDataSchema.parseAsync(data);
		},
	});
};

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (value: { username: string }) => {
			await ky.post("/api/users", { json: value });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};
