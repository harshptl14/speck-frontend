"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

interface ConfirmModalProps {
  triggerButton: React.ReactNode;
  title: string;
  description: string;
  cancelButtonText?: string;
  confirmButtonText: string;
  confirmButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  actionId: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  triggerButton,
  title,
  description,
  cancelButtonText = "Cancel",
  confirmButtonText,
  confirmButtonVariant = "default",
  actionId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //  const { deleteAccount, isDeleting } = ();
  const { deleteAccount, isDeleting } = useDeleteAccount();

  const handleConfirm = async (actionId: string) => {
    // Here you would typically call an API or dispatch an action
    if (actionId === "delete-account") {
      await deleteAccount();
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {cancelButtonText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={() => handleConfirm(actionId)}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
