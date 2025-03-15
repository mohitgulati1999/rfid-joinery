
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Check, X, Eye } from "lucide-react";

const AdminPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const mockPayments = [
    {
      id: "1",
      memberName: "John Doe",
      amount: 50,
      hoursRequested: 10,
      date: new Date("2023-05-10"),
      status: "pending",
      proofUrl: "https://via.placeholder.com/150"
    },
    {
      id: "2",
      memberName: "Jane Smith",
      amount: 75,
      hoursRequested: 15,
      date: new Date("2023-05-09"),
      status: "approved",
      proofUrl: "https://via.placeholder.com/150"
    },
    {
      id: "3",
      memberName: "Bob Johnson",
      amount: 25,
      hoursRequested: 5,
      date: new Date("2023-05-08"),
      status: "rejected",
      proofUrl: "https://via.placeholder.com/150"
    }
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-gradient">Payment Approvals</h1>

      <GlassMorphismCard className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-primary" />
            Pending Payment Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Member</TableHead>
                  <TableHead className="text-white/70">Amount</TableHead>
                  <TableHead className="text-white/70">Hours</TableHead>
                  <TableHead className="text-white/70">Date</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-white/10">
                    <TableCell className="font-medium text-white">
                      {payment.memberName}
                    </TableCell>
                    <TableCell className="text-white/80">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-white/80">{payment.hoursRequested} hrs</TableCell>
                    <TableCell className="text-white/80">{formatDate(payment.date)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'approved' 
                          ? 'bg-green-500/20 text-green-400' 
                          : payment.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-green-500">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive">
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
      </GlassMorphismCard>
    </div>
  );
};

export default AdminPayments;
