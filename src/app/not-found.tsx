import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md space-y-2 p-4 text-center">
        <h1 className="font-bold text-4xl tracking-tight">Page Not Found</h1>
        <p>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/">Go to Home</Link>
      </div>
    </div>
  );
}
