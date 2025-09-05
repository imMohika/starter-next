import type {LogLevel, TLogger} from "@/lib/logger";

const createClientLogger = (withConsole = true): TLogger => {
	return {
		debug: <T extends object>(obj: T, msg?: string) => {
			console.debug(msg, obj);
		},
		info: <T extends object>(obj: T, msg?: string) => {
			if (withConsole) console.info(msg, obj);
			sendLogToServer("info", obj, msg).catch(() => {
				console.error("Failed to send log to server");
			});
		},
		warn: <T extends object>(obj: T, msg?: string) => {
			if (withConsole) console.warn(msg, obj);
			sendLogToServer("warn", obj, msg).catch(() => {
				console.error("Failed to send log to server");
			});
		},
		error: <T extends object>(obj: T, msg?: string) => {
			if (withConsole) console.error(msg, obj);
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
