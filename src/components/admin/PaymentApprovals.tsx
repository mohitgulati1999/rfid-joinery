
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Check, X, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Payment {
  id: string;
  memberName: string;
  amount: number;
  hoursRequested: number;
  date: Date | string;
  status: "pending" | "approved" | "rejected";
  proofUrl: string;
}

const PaymentApprovals = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      memberName: "John Doe",
      amount: 50,
      hoursRequested: 10,
      date: new Date("2023-05-10"),
      status: "pending",
      proofUrl: "https://via.placeholder.com/300"
    },
    {
      id: "2",
      memberName: "Jane Smith",
      amount: 75,
      hoursRequested: 15,
      date: new Date("2023-05-09"),
      status: "approved",
      proofUrl: "https://via.placeholder.com/300"
    },
    {
      id: "3",
      memberName: "Bob Johnson",
      amount: 25,
      hoursRequested: 5,
      date: new Date("2023-05-08"),
      status: "rejected",
      proofUrl: "https://via.placeholder.com/300"
    },
    {
      id: "4",
      memberName: "Alice Williams",
      amount: 100,
      hoursRequested: 20,
      date: new Date("2023-05-07"),
      status: "pending",
      proofUrl: "https://via.placeholder.com/300"
    }
  ]);
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleApprove = (paymentId: string) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "approved" } 
        : payment
    ));
    toast.success("Payment approved successfully");
  };
  
  const handleReject = (paymentId: string) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "rejected" } 
        : payment
    ));
    toast.error("Payment rejected");
  };
  
  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-primary" />
            Payment Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.memberName}
                    </TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.hoursRequested} hrs</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'approved' 
                          ? 'bg-green-500/20 text-green-500' 
                          : payment.status === 'rejected'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleView(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-green-500"
                              onClick={() => handleApprove(payment.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => handleReject(payment.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment proof dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{selectedPayment.memberName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedPayment.memberName}</p>
                    <p className="text-xs text-muted-foreground">${selectedPayment.amount} for {selectedPayment.hoursRequested} hours</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-md">
                <img 
                  src={selectedPayment.proofUrl} 
                  alt="Payment proof" 
                  className="w-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-xl font-bold">${selectedPayment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm">{formatDate(selectedPayment.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm">{selectedPayment.hoursRequested} hours</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedPayment.status === 'approved' 
                      ? 'bg-green-500/20 text-green-500' 
                      : selectedPayment.status === 'rejected'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            {selectedPayment && selectedPayment.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (selectedPayment) {
                      handleReject(selectedPayment.id);
                      setViewDialogOpen(false);
                    }
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    if (selectedPayment) {
                      handleApprove(selectedPayment.id);
                      setViewDialogOpen(false);
                    }
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentApprovals;
