"use client";

import { isProduction } from "@/lib/constants";
import { HttpError } from "@/lib/error/http-error";
import type { FC } from "react";

type ErrorPageProps = {
	statusCode?: number | null;
	error?: Error | HttpError | null;
	message?: string;
	children?: never;
	reset?: () => void;
};

export const ErrorCard: FC<ErrorPageProps> = ({
	message,
	statusCode,
	error,
	reset,
}) => {
	const handleReset = () => {
		window.location.reload();
		reset?.();
	};

	return (
		<div className="m-auto min-h-full w-full max-w-md p-10">
			<h1 className="border-red-500 border-s-8 ps-4 font-cal text-6xl text-emphasis">
				{statusCode}
			</h1>
			<h2 className="mt-6 max-w-2xl font-medium text-2xl text-emphasis">
				Something went wrong.
			</h2>

			<pre className="w-full max-w-2xl whitespace-normal break-words rounded-md bg-emphasis p-4 text-emphasis">
				{message}
			</pre>

			<button
				type="button"
				color="secondary"
				className="ml-2"
				onClick={handleReset}
			>
				Try again
			</button>

			{/*TODO)) move to dialog or something*/}
			{!isProduction && (
				<div className="flex-wrap">
					<ErrorDebugDetail error={error} />
				</div>
			)}
		</div>
	);
};

const ErrorDebugDetail: FC<{
	error: ErrorPageProps["error"];
	children?: never;
}> = (props) => {
	const { error: e } = props;

	const detailMap = [
		["error.message", e?.message],
		["error.name", e?.name],
		["error.class", e instanceof Error ? e.constructor.name : undefined],
		["http.url", e instanceof HttpError ? e.url : undefined],
		["http.status", e instanceof HttpError ? e.statusCode : undefined],
		["http.cause", e instanceof HttpError ? e.cause?.message : undefined],
		["error.stack", e instanceof Error ? e.stack : undefined],
	];

	return (
		<div className="overflow-hidden bg-default shadow sm:rounded-lg">
			<div className="border-subtle border-t px-4 py-5 sm:p-0">
				<dl className="sm:divide-y sm:divide-subtle">
					{detailMap.map(([key, value]) => {
						if (value !== undefined) {
							return (
								<div
									key={key}
									className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
								>
									<dt className="font-bold text-emphasis text-sm">{key}</dt>
									<dd className="mt-1 text-emphasis text-sm sm:col-span-2 sm:mt-0">
										{value}
									</dd>
								</div>
							);
						}
					})}
				</dl>
			</div>
		</div>
	);
};
