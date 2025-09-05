import type { z } from "zod";

export type Params = {
  [param: string]: string | string[] | undefined;
};

export type SearchParams = {
  [param: string]: string | string[] | undefined;
};

export type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

export type LayoutProps = {
  params: Promise<Params>;
  children: React.ReactElement;
};

// biome-ignore lint/suspicious/noExplicitAny: based on zod source
export type ZodObjectSchema = z.ZodObject<any, any>;
