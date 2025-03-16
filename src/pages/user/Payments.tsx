import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Member, PaymentRequest } from "@/types";
import { CreditCard, CheckCircle2 } from "lucide-react";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import PaymentRequestComponent from "@/components/user/PaymentRequest";
import { paymentService } from "@/services/paymentService";

const UserPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentHistory, setPaymentHistory] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!user) {
    return null;
  }

  const member = user as Member;
  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const history = await paymentService.getMemberPaymentHistory(user.id);
        setPaymentHistory(history);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentHistory();
  }, [user.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Add hours to your membership</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/user/dashboard')}
          className="mt-4 md:mt-0"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentRequestComponent />
        </div>

        <div className="space-y-6">
          <GlassMorphismCard className="p-6">
            <CardTitle className="mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Information
            </CardTitle>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Bank Transfer</h3>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  RFID Daycare Inc.<br />
                  ACC: 1234567890<br />
                  IFSC: ABCD0123456
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">UPI ID</h3>
                <p className="font-mono text-sm bg-muted p-2 rounded">
                  rfiddaycare@upi
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h3 className="font-medium mb-1 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                    Current Price
                  </h3>
                  <p className="text-2xl font-bold">$5.00 <span className="text-sm font-normal text-muted-foreground">per hour</span></p>
                </div>
              </div>
            </div>
          </GlassMorphismCard>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">Loading payment history...</div>
              ) : paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="font-medium">Payment #{payment.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Added {payment.hoursRequested} hours
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.requestDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${payment.amount.toFixed(2)}</p>
                      <p className={`text-xs ${
                        payment.status === 'approved' 
                          ? 'text-green-600' 
                          : payment.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No payment history yet
                </div>
              )}
              
              {!isLoading && paymentHistory.length === 0 && (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="font-medium">Payment #{1000 + i}</p>
                      <p className="text-sm text-muted-foreground">Added 10 hours</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(Date.now() - i * 86400000 * 5).toISOString())}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$50.00</p>
                      <p className="text-xs text-green-600">Approved</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPayments;
