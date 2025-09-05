import { AddUserForm } from "@/app/users/_components/add-user-form";
import { UserList } from "@/app/users/_components/user-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="grid grid-cols-2 items-center justify-center justify-items-center gap-8">
      <div>
        <p className="font-semibold text-lg">User List:</p>
        <UserList />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <AddUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
