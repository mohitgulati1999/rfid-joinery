import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Member } from "@/types";
import { CreditCard, Edit, Trash, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/memberService";

const UserManagement: React.FC = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rfidNumber: "",
    membershipHours: 0,
    isActive: true
  });

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: memberService.getAllMembers,
  });

  const addMemberMutation = useMutation({
    mutationFn: (newMember: Omit<Member, 'id' | 'role' | 'totalHoursUsed' | 'remainingHours'>) => 
      memberService.addMember(newMember),
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsAddUserOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to add member");
    }
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Member> }) => 
      memberService.updateMember(id, data),
    onSuccess: () => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsEditUserOpen(false);
    },
    onError: () => {
      toast.error("Failed to update member");
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => 
      memberService.deleteMember(id),
    onSuccess: () => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      toast.error("Failed to delete member");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      rfidNumber: "",
      membershipHours: 0,
      isActive: true
    });
  };

  const openEditDialog = (member: Member) => {
    setSelectedUser(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      rfidNumber: member.rfidNumber,
      membershipHours: member.membershipHours,
      isActive: member.isActive
    });
    setIsEditUserOpen(true);
  };

  const handleAddMember = () => {
    const newMember = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rfidNumber: formData.rfidNumber,
      membershipHours: formData.membershipHours,
      isActive: formData.isActive,
      role: "member" as const
    };
    
    addMemberMutation.mutate(newMember);
  };

  const handleUpdateMember = () => {
    if (!selectedUser) return;
    
    const updatedData: Partial<Member> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rfidNumber: formData.rfidNumber,
      membershipHours: formData.membershipHours,
      isActive: formData.isActive
    };
    
    updateMemberMutation.mutate({ id: selectedUser.id, data: updatedData });
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      deleteMemberMutation.mutate(id);
    }
  };

  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Members Management</h2>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {isLoading ? (
        <div>Loading members...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>RFID</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-primary" />
                      {member.rfidNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    {member.remainingHours} / {member.membershipHours}
                  </TableCell>
                  <TableCell>
                    {member.isActive ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <XCircle className="h-4 w-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Member Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rfidNumber">RFID Number</Label>
              <Input
                id="rfidNumber"
                name="rfidNumber"
                value={formData.rfidNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="membershipHours">Membership Hours</Label>
              <Input
                id="membershipHours"
                name="membershipHours"
                type="number"
                value={formData.membershipHours}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone (optional)</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rfidNumber">RFID Number</Label>
              <Input
                id="edit-rfidNumber"
                name="rfidNumber"
                value={formData.rfidNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-membershipHours">Membership Hours</Label>
              <Input
                id="edit-membershipHours"
                name="membershipHours"
                type="number"
                value={formData.membershipHours}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
