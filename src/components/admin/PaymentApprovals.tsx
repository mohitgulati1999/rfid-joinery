
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { PaymentRequest } from "@/types";
import { CheckCircle2, XCircle, CreditCard, ImageIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/paymentService";

const PaymentApprovals: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getAllPaymentRequests,
  });

  const approveMutation = useMutation({
    mutationFn: (paymentId: string) => 
      paymentService.approvePaymentRequest(paymentId, "admin1"),
    onSuccess: () => {
      toast.success("Payment approved successfully");
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: () => {
      toast.error("Failed to approve payment");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (paymentId: string) => 
      paymentService.rejectPaymentRequest(paymentId, "admin1"),
    onSuccess: () => {
      toast.error("Payment rejected");
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: () => {
      toast.error("Failed to reject payment");
    }
  });

  const viewPaymentProof = (payment: PaymentRequest) => {
    setSelectedPayment(payment);
    setShowImageDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = (paymentId: string) => {
    approveMutation.mutate(paymentId);
  };

  const handleReject = (paymentId: string) => {
    rejectMutation.mutate(paymentId);
  };

  const pendingPayments = payments?.filter(payment => payment.status === "pending") || [];

  return (
    <>
      {isLoading ? (
        <div className="text-center p-4">Loading payment requests...</div>
      ) : pendingPayments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground text-lg">No pending payments</CardTitle>
            <CardDescription className="text-center">
              All payment requests have been processed
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.memberName}</div>
                      <div className="text-sm text-muted-foreground">{payment.memberId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${payment.amount}</TableCell>
                  <TableCell>{payment.hoursRequested} hrs</TableCell>
                  <TableCell>{formatDate(payment.requestDate)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewPaymentProof(payment)}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleApprove(payment.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleReject(payment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Payment Proof Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              {selectedPayment && `Submitted by ${selectedPayment.memberName} on ${formatDate(selectedPayment.requestDate)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {selectedPayment ? (
              <>
                <div className="border rounded-lg overflow-hidden max-h-80">
                  <img 
                    src={selectedPayment.paymentProofImage} 
                    alt="Payment proof" 
                    className="object-contain max-h-80"
                  />
                </div>
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="font-medium">${selectedPayment.amount}</p>
                    <p className="text-sm text-muted-foreground">for {selectedPayment.hoursRequested} hours</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => {
                        handleApprove(selectedPayment.id);
                        setShowImageDialog(false);
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => {
                        handleReject(selectedPayment.id);
                        setShowImageDialog(false);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <p>No image available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentApprovals;
