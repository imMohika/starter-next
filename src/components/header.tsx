import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex gap-4 border-border border-b p-4">
      <Link href="/">Home</Link>
      <Link href="/simple-form">Simple Form</Link>
      <Link href="/table">Table</Link>
    </header>
  );
};
