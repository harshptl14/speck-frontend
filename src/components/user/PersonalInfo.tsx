"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, User } from "lucide-react";
import { InfoField } from "../infoField";
import ConfirmModal from "../confirmModal";
import { User as UserType } from "@/hooks/useUser";

interface PersonalInformationProps {
  user: UserType;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({
  user,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>Your account details and preferences.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src="/placeholder.svg?height=80&width=80"
            alt="Profile picture"
          />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm">
          Change Photo
        </Button>
      </div> */}

      <InfoField label="Username" value={user.name} />
      <InfoField label="Email" value={user.email} />
      <InfoField
        label="Created at"
        value={new Date(user.createdAt).toLocaleDateString()}
      />

      <Button variant="default" size="sm" className="flex items-center">
        <a href={`${process.env.NEXT_PUBLIC_API}/speck/v1/auth/logout`}>
          Logout
        </a>
      </Button>

      <Separator className="my-4" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently remove your account and all of its contents. This action
          is irreversible.
        </p>
        <ConfirmModal
          triggerButton={
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          }
          title="Are you sure you want to delete your account?"
          description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          confirmButtonText="Yes, delete my account"
          actionId="delete-account"
        />
      </div>
    </CardContent>
  </Card>
);
