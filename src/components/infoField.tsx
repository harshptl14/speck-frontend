import React from "react";
import { Label } from "@/components/ui/label";

interface InfoFieldProps {
  label: string;
  value: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="grid gap-1">
    <Label htmlFor={label.toLowerCase()}>{label}</Label>
    <p
      id={label.toLowerCase()}
      className="text-sm font-medium text-muted-foreground"
    >
      {value}
    </p>
  </div>
);
