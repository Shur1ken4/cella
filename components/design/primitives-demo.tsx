"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copy } from "@/lib/copy";
import { DemoLabel } from "./section";

export function PrimitivesDemo() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="flex flex-col gap-5">
        <DemoLabel>Input · Label · Select</DemoLabel>
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Deposit amount</Label>
          <Input id="amount" inputMode="decimal" placeholder="10,000" className="nums" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount-bad">Invalid</Label>
          <Input id="amount-bad" aria-invalid defaultValue="-5" className="nums" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-input">Disabled</Label>
          <Input id="disabled-input" disabled defaultValue="Locked" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Event</Label>
          <Select defaultValue="IND_CLEARED">
            <SelectTrigger className="w-64" aria-label="Event">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(copy.schemas).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <DemoLabel>Tabs</DemoLabel>
        <Tabs defaultValue="idea">
          <TabsList>
            <TabsTrigger value="idea">The idea</TabsTrigger>
            <TabsTrigger value="how">How to use it</TabsTrigger>
          </TabsList>
          <TabsContent value="idea" className="type-small pt-2 text-text-muted">
            Scene track one.
          </TabsContent>
          <TabsContent value="how" className="type-small pt-2 text-text-muted">
            Scene track two.
          </TabsContent>
        </Tabs>

        <Separator />

        <DemoLabel>Tooltip · Dialog · Progress</DemoLabel>
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Why is this locked?">
                <Info aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Only the Lab/CRO can sign this</TooltipContent>
          </Tooltip>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign attestation?</DialogTitle>
                <DialogDescription>
                  Meridian Clinical Research will sign “Phase I complete” for BAP-001 on devnet.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton>
                <Button>Sign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Progress value={62} aria-label="Upload progress" />
      </div>
    </div>
  );
}
