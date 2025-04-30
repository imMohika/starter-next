"use client";

import { useUsers } from "@/hooks/use-users";

export const UserList = () => {
	const { data } = useUsers();
	if (!data) {
		return "Loading...";
	}

	return (
		<ul className="ms-6 list-disc [&>li]:mt-2">
			{data.map(({ username, created_at }) => (
				<li key={username}>
					{username} ({created_at.toDateString()})
				</li>
			))}
		</ul>
	);
};
