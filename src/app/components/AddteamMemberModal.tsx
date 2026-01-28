import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AddTeamMemberDialogProps {
  onAdd: (email: string) => void;
}

export function AddTeamMemberDialog({ onAdd }: AddTeamMemberDialogProps) {
  const [email, setEmail] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add member</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add team member</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button onClick={() => onAdd(email)} className="mt-4">
          Add Member
        </Button>
      </DialogContent>
    </Dialog>
  );
}
