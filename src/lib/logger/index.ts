export type LogFn = <T extends object>(obj: T, msg?: string) => void;

export const logLevels = ["error", "warn", "info", "debug"] as const;
export type LogLevel = (typeof logLevels)[number];

export type TLogger = {
  [key in LogLevel]: LogFn;
};
