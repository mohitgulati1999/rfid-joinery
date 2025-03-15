
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
import { PaymentRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Filter,
  CreditCard,
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

interface PaymentApprovalsProps {
  paymentRequests: PaymentRequest[];
}

const PaymentApprovals = ({ paymentRequests }: PaymentApprovalsProps) => {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [viewRequest, setViewRequest] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const filteredRequests = paymentRequests.filter((request) => {
    if (filter === "all") return true;
    if (filter === "pending") return request.status === "pending";
    if (filter === "approved") return request.status === "approved";
    if (filter === "rejected") return request.status === "rejected";
    return true;
  });

  const handleApprove = async (requestId: string) => {
    setLoading({...loading, [requestId]: true});
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Payment approved successfully");
    } catch (error) {
      toast.error("Failed to approve payment");
    } finally {
      setLoading({...loading, [requestId]: false});
    }
  };

  const handleReject = async (requestId: string) => {
    setLoading({...loading, [requestId]: true});
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Payment rejected");
    } catch (error) {
      toast.error("Failed to reject payment");
    } finally {
      setLoading({...loading, [requestId]: false});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Payment Requests</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hours Payment Requests</CardTitle>
          <CardDescription>
            Review and approve member payment requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No payment requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.memberName}</div>
                      <div className="text-sm text-muted-foreground">ID: {request.memberId}</div>
                    </TableCell>
                    <TableCell>
                      {format(request.requestDate, "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(request.requestDate, "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${request.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{request.hoursRequested} hours</div>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      )}
                      {request.status === "approved" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" /> Approved
                        </Badge>
                      )}
                      {request.status === "rejected" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                          <XCircle className="mr-1 h-3 w-3" /> Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(request.id)}
                              disabled={loading[request.id]}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleReject(request.id)}
                              disabled={loading[request.id]}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Payment Proof Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              Request from {viewRequest?.memberName} for {viewRequest?.hoursRequested} hours
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Request Date:</div>
                <div>{viewRequest?.requestDate && format(viewRequest.requestDate, "PPP p")}</div>
                
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">${viewRequest?.amount.toFixed(2)}</div>
                
                <div className="text-muted-foreground">Hours:</div>
                <div className="font-medium">{viewRequest?.hoursRequested} hours</div>
                
                <div className="text-muted-foreground">Status:</div>
                <div>
                  {viewRequest?.status === "pending" && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                  )}
                  {viewRequest?.status === "approved" && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>
                  )}
                  {viewRequest?.status === "rejected" && (
                    <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {/* In a real app, we would use viewRequest.paymentProofImage */}
              <img
                src="https://via.placeholder.com/800x600.png?text=Payment+Receipt"
                alt="Payment proof"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            {viewRequest?.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReject(viewRequest.id)}
                  disabled={loading[viewRequest.id]}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(viewRequest.id)}
                  disabled={loading[viewRequest.id]}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={() => setViewRequest(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentApprovals;
