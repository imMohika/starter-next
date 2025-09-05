import { SimpleForm } from "@/app/simple-form/_components/simple-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SimpleFormPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple Form</CardTitle>
      </CardHeader>
      <CardContent>
        <SimpleForm />
      </CardContent>
    </Card>
  );
}
