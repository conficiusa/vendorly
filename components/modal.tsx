"use client";

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Modal = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    router.back();
  };
  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="overflow-hidden px-2">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="w-full max-h-[80dvh] px-4">{children}</ScrollArea>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default Modal;
