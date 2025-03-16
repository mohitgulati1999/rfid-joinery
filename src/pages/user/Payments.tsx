
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Member, PaymentRequest } from "@/types";
import { CreditCard, CheckCircle2, Clock, XCircle } from "lucide-react";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import PaymentRequestComponent from "@/components/user/PaymentRequest";
import { paymentService } from "@/services/paymentService";
import { useQuery } from "@tanstack/react-query";

const UserPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const member = user as Member;
  
  const { data: paymentHistory, isLoading, refetch } = useQuery({
    queryKey: ['paymentHistory', member.id],
    queryFn: () => paymentService.getMemberPaymentHistory(member.id),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return (
          <span className="flex items-center text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-500">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center text-yellow-500">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Hours & Payments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{member.remainingHours} hrs</div>
            <p className="text-xs text-muted-foreground mt-2">
              {member.totalHoursUsed} hours used of {member.membershipHours} total
            </p>
            <div className="w-full h-2 bg-secondary rounded-full mt-3">
              <div 
                className="h-full rounded-full bg-primary" 
                style={{ width: `${(member.remainingHours / member.membershipHours) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {paymentHistory?.filter(p => p.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting approval from admin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground mt-2">
              {member.isActive ? 'Your account is in good standing' : 'Your account is inactive'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <PaymentRequestComponent 
            member={member}
            onRequestSubmit={() => refetch()}
          />
        </div>
        
        <GlassMorphismCard>
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Payment History
            </CardTitle>
            <CardDescription className="text-white/60">
              Your recent payment requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6 text-white/60">Loading payment history...</div>
            ) : paymentHistory?.length === 0 ? (
              <div className="text-center py-6 text-white/60">No payment history found</div>
            ) : (
              <div className="space-y-4">
                {paymentHistory?.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-white/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-white">${payment.amount} for {payment.hoursRequested} hours</div>
                        <div className="text-sm text-white/60">{formatDate(payment.requestDate)}</div>
                      </div>
                    </div>
                    <div>{getStatusBadge(payment.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </GlassMorphismCard>
      </div>
    </div>
  );
};

export default UserPayments;
