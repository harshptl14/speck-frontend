import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const PlanBilling: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Plan & Billing</CardTitle>
      <CardDescription>
        Manage your subscription and billing details.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-4">
        <CreditCard className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="font-medium">Free Plan</p>
          <p className="text-sm text-muted-foreground">
            You are currently on the free plan.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        Upgrade Plan
      </Button>
    </CardContent>
  </Card>
);
