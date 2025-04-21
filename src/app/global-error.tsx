"use client";

import type { NextPage } from "next";

import type { ErrorPageProps } from "./error";
import CustomError from "./error";

export const GlobalError: NextPage<ErrorPageProps> = (props) => {
	return (
		<html lang="en">
			<body>
				<CustomError {...props} />
			</body>
		</html>
	);
};

export default GlobalError;
