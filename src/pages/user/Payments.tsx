
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Member } from "@/types";
import { toast } from "sonner";
import { CreditCard, Upload, CheckCircle2 } from "lucide-react";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";

const UserPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHours, setSelectedHours] = useState(5);
  const [totalPrice, setTotalPrice] = useState(25);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  if (!user || user.role !== "member") {
    navigate("/login");
    return null;
  }

  const member = user as Member;
  const pricePerHour = 5; // $5 per hour

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(e.target.value, 10);
    setSelectedHours(hours);
    setTotalPrice(hours * pricePerHour);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImage) {
      toast.error("Please upload a payment screenshot");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Payment request submitted successfully!");
      setIsSubmitting(false);
      setUploadedImage(null);
      setUploadPreview(null);
    }, 1500);
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
          <Card>
            <CardHeader>
              <CardTitle>Request Additional Hours</CardTitle>
              <CardDescription>
                Choose the number of hours and upload your payment proof
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hours">Number of Hours</Label>
                    <div className="flex items-center gap-4 mt-1.5">
                      <Input
                        id="hours"
                        type="number"
                        min={1}
                        max={100}
                        value={selectedHours}
                        onChange={handleHoursChange}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">× ${pricePerHour}/hour</span>
                      <span className="ml-auto font-semibold text-lg">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label htmlFor="payment-proof" className="block mb-3">
                      Upload Payment Screenshot
                    </Label>
                    <div className="grid gap-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative">
                        {uploadPreview ? (
                          <div className="relative">
                            <img 
                              src={uploadPreview} 
                              alt="Payment proof" 
                              className="max-h-[300px] mx-auto rounded-md object-contain" 
                            />
                            <button 
                              type="button" 
                              onClick={() => {
                                setUploadedImage(null);
                                setUploadPreview(null);
                              }}
                              className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground mb-1">
                              Drag and drop or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Supports JPG, PNG or PDF up to 5MB
                            </p>
                          </>
                        )}
                        <Input
                          id="payment-proof"
                          type="file"
                          accept="image/*,.pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !uploadedImage}
                >
                  {isSubmitting ? "Submitting..." : "Submit Payment Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
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
                  <p className="text-2xl font-bold">${pricePerHour}.00 <span className="text-sm font-normal text-muted-foreground">per hour</span></p>
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-medium">Payment #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Added 10 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(10 * pricePerHour).toFixed(2)}</p>
                    <p className="text-xs text-green-600">Approved</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPayments;
