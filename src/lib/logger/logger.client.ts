import type { LogLevel, TLogger } from "@/lib/logger";

const createClientLogger = (withConsole = true): TLogger => {
	return {
		debug: <T extends object>(obj: T, msg?: string) => {
			console.debug(obj, msg);
		},
		info: <T extends object>(obj: T, msg?: string) => {
			if (withConsole) console.info(obj, msg);
			sendLogToServer("info", obj, msg).catch(() => {
				console.error("Failed to send log to server");
			});
		},
		warn: <T extends object>(obj: T, msg?: string) => {
			if (withConsole) console.warn(obj, msg);
			sendLogToServer("warn", obj, msg).catch(() => {
				console.error("Failed to send log to server");
			});
		},
		error: <T extends object>(obj: T, msg?: string) => {
			if (withConsole) console.error(obj, msg);
			sendLogToServer("error", obj, msg).catch(() => {
				console.error("Failed to send log to server");
			});
		},
	};
};

export const clientLogger = createClientLogger();

export const sendLogToServer = async <T extends object>(
	level: LogLevel,
	first: T,
	msg?: string,
) => {
	await fetch("/api/log", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			level,
			first: {
				...first,
				labels: { source: "client", path: window.location.pathname },
			},
			msg,
		}),
	});
};
