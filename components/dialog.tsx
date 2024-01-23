"use client";
import * as React from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function DialogGeneric({
  children,
  title,
  subtitle,
  trigger,
  enabled = true,
  additionalAction,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  trigger: React.ReactNode;
  enabled?: boolean;
  additionalAction?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={enabled ? setOpen : open ? setOpen : undefined}
      >
        <DialogTrigger>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="redOutline">Close</Button>
            </DialogClose>
            {additionalAction}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={enabled ? setOpen : undefined}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="space-y-4">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{subtitle}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
          {additionalAction}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
