
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Member } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Plus,
  UserPlus,
  Edit,
  Clock,
  CreditCard,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserManagementProps {
  members: Member[];
}

const UserManagement = ({ members }: UserManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddHoursDialog, setOpenAddHoursDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState(5);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.rfidNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddHours = () => {
    // In a real app, this would update the user's hours via an API
    console.log(`Adding ${hoursToAdd} hours to member ${selectedMember?.id}`);
    setOpenAddHoursDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={16} />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Create a new member account and assign an RFID card
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="john@example.com"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rfid" className="text-right">
                  RFID
                </Label>
                <Input
                  id="rfid"
                  placeholder="RF123456"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">
                  Initial Hours
                </Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="10"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenAddDialog(false)}>Save Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Manage daycare members and their RFID cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>RFID Number</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-mono">{member.rfidNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{member.membershipHours - member.totalHoursUsed} remaining</div>
                    <div className="text-sm text-muted-foreground">
                      {member.totalHoursUsed} used / {member.membershipHours} total
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member);
                            setOpenAddHoursDialog(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Add Hours</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>View Payments</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {member.isActive ? (
                          <DropdownMenuItem className="cursor-pointer text-amber-600">
                            <UserX className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="cursor-pointer text-green-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openAddHoursDialog} onOpenChange={setOpenAddHoursDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Hours</DialogTitle>
            <DialogDescription>
              Add hours to {selectedMember?.name}'s account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-hours" className="text-right">
                Hours
              </Label>
              <Input
                id="add-hours"
                type="number"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(Number(e.target.value))}
                min={1}
                className="col-span-3"
              />
            </div>
            <div className="pl-28">
              <p className="text-sm text-muted-foreground">Current hours: {selectedMember?.membershipHours}</p>
              <p className="text-sm font-medium mt-1">
                New total: {(selectedMember?.membershipHours || 0) + hoursToAdd} hours
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddHoursDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHours}>Add Hours</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
