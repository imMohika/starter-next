import { PersonsTable } from "@/app/table/_components/persons-table";
import { type Person, randomPerson } from "@/app/table/_utils/person";

export default function TableExamplePage() {
  const data: Array<Person> = Array.from({ length: 69 }, randomPerson);
  return (
    <div className="p-4">
      <PersonsTable data={data} />
    </div>
  );
}
