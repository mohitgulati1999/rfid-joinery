
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Member } from "@/types";
import { 
  Edit, 
  Plus, 
  AlertTriangle, 
  UserPlus, 
  Search,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { memberService } from "@/services/memberService";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  rfidNumber: z.string().regex(/^RF\d{6}$/, {
    message: "RFID Number must follow format RF followed by 6 digits",
  }),
  membershipHours: z.number().min(0),
  isActive: z.boolean().default(true),
});

interface UserManagementProps {
  members: Member[];
}

const UserManagement: React.FC<UserManagementProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAddHoursDialog, setShowAddHoursDialog] = useState(false);
  const [hoursToAdd, setHoursToAdd] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      rfidNumber: "RF",
      membershipHours: 0,
      isActive: true,
    },
  });

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.rfidNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    form.reset({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      address: member.address || "",
      rfidNumber: member.rfidNumber,
      membershipHours: member.membershipHours,
      isActive: member.isActive
    });
    setEditMode(true);
  };

  const handleAddHours = (member: Member) => {
    setSelectedMember(member);
    setHoursToAdd(0);
    setShowAddHoursDialog(true);
  };

  const submitAddHours = async () => {
    if (!selectedMember) return;
    
    try {
      await memberService.addHours(selectedMember.id, hoursToAdd);
      toast.success(`Added ${hoursToAdd} hours to ${selectedMember.name}`);
      setShowAddHoursDialog(false);
    } catch (error) {
      toast.error("Failed to add hours");
    }
  };

  const handleDeactivate = (member: Member) => {
    // Toggle activation status
    memberService.updateMember(member.id, { isActive: !member.isActive })
      .then(() => {
        toast.success(`${member.name} has been ${member.isActive ? 'deactivated' : 'activated'}`);
      })
      .catch(error => {
        toast.error("Failed to update member status");
      });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editMode && selectedMember) {
        // Update existing member
        await memberService.updateMember(selectedMember.id, values);
        toast.success("Member updated successfully");
      } else {
        // Create new member
        await memberService.addMember({
          ...values,
          role: "member",
          password: "password123", // Default password for testing
          totalHoursUsed: 0
        });
        toast.success("Member added successfully");
      }
      form.reset();
      setEditMode(false);
      setSelectedMember(null);
    } catch (error) {
      toast.error("Failed to save member");
    }
  };

  const openAddMemberDialog = () => {
    setEditMode(false);
    setSelectedMember(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      rfidNumber: "RF",
      membershipHours: 0,
      isActive: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={openAddMemberDialog}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Member" : "Add New Member"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rfidNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RFID Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="membershipHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Member can check in/out when active
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">{editMode ? "Update" : "Add"} Member</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>RFID</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{member.rfidNumber}</TableCell>
                  <TableCell>
                    <div>
                      {member.remainingHours} / {member.membershipHours}
                      <div className="w-24 h-1.5 bg-secondary rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            member.remainingHours / member.membershipHours < 0.2 
                              ? 'bg-destructive' 
                              : 'bg-primary'
                          }`} 
                          style={{ width: `${(member.remainingHours / member.membershipHours) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      member.isActive 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {member.isActive ? (
                        <><Check className="mr-1 h-3 w-3" /> Active</>
                      ) : (
                        <><X className="mr-1 h-3 w-3" /> Inactive</>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleAddHours(member)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Hours</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeactivate(member)}
                        className={member.isActive ? "text-red-500" : "text-green-500"}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span className="sr-only">
                          {member.isActive ? "Deactivate" : "Activate"}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Hours Dialog */}
      <Dialog open={showAddHoursDialog} onOpenChange={setShowAddHoursDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Hours</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <FormItem>
              <FormLabel>Hours to Add</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Adding hours to {selectedMember?.name}'s account
              </FormDescription>
            </FormItem>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={submitAddHours}>Add Hours</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
