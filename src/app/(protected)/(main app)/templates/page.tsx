// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates",
};

export default function TemplatesPage() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileIcon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Templates are coming soon. We're working hard to bring you the best
            experience.
          </p>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <Button variant="outline">Stay Updated</Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
