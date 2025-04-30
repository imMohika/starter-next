import "server-only";
import { sleep } from "@/lib/utils";

// Dummy Database to emulate server-side actions
class UserDatabase {
	private rows: Array<DBUserRow> = [];

	async all() {
		await sleep(500);
		return [...this.rows];
	}

	async create(username: string) {
		await sleep(500);
		this.rows.push({
			username,
			created_at: new Date(),
		});
	}
}

export interface DBUserRow {
	username: string;
	created_at: Date;
}

export const userDatabase = new UserDatabase();
