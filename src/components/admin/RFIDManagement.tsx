
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Member } from "@/types";
import { NfcIcon, UserPlus, Fingerprint, KeySquare, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RFIDManagementProps {
  members: Member[];
}

const RFIDManagement = ({ members }: RFIDManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigningRFID, setIsAssigningRFID] = useState(false);
  const [rfidValue, setRfidValue] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.rfidNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignRFID = () => {
    if (!rfidValue.trim()) {
      toast.error("Please enter an RFID value");
      return;
    }

    // In a real app, this would be an API call
    toast.success(`RFID ${rfidValue} assigned successfully`);
    setIsAssigningRFID(false);
    setRfidValue("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <NfcIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">RFID Card Management</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search members or RFID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[250px]"
            />
          </div>
          <Dialog
            open={isAssigningRFID}
            onOpenChange={setIsAssigningRFID}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <KeySquare size={16} />
                Assign RFID
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign RFID Card</DialogTitle>
                <DialogDescription>
                  Link an RFID card to a member account
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rfid-value" className="text-right">
                    RFID Number
                  </Label>
                  <div className="relative col-span-3">
                    <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="rfid-value"
                      value={rfidValue}
                      onChange={(e) => setRfidValue(e.target.value)}
                      placeholder="RF123456"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="member" className="text-right">
                    Member
                  </Label>
                  <select
                    id="member"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select a member
                    </option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssigningRFID(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignRFID}>Assign RFID</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RFID Cards</CardTitle>
          <CardDescription>
            View and manage RFID cards assigned to members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFID Number</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No RFID cards found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-mono">{member.rfidNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </TableCell>
                    <TableCell>
                      {member.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">Today, 2:30 PM</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Disable
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RFIDManagement;
