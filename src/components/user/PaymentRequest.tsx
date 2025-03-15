
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Upload, Info, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Member } from "@/types";

interface PaymentRequestProps {
  member: Member;
  onSubmit: (data: {
    hours: number;
    amount: number;
    paymentProof: File | null;
  }) => void;
}

const PaymentRequest = ({ member, onSubmit }: PaymentRequestProps) => {
  const [hours, setHours] = useState(5);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Hourly rate - in a real app this would come from the backend
  const hourlyRate = 10;
  const amount = hours * hourlyRate;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProof(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentProof) {
      toast({
        title: "Payment proof required",
        description: "Please upload a payment receipt or screenshot",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the data to the backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      onSubmit({
        hours,
        amount,
        paymentProof,
      });
      
      toast({
        title: "Payment request submitted",
        description: "Your request has been sent to administrators for approval",
      });
      
      // Reset form
      setHours(5);
      setPaymentProof(null);
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassMorphismCard className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Request Additional Hours</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="hours">Hours to Purchase</Label>
                  <span className="text-2xl font-bold">{hours}</span>
                </div>
                <Slider
                  id="hours"
                  min={1}
                  max={50}
                  step={1}
                  value={[hours]}
                  onValueChange={(value) => setHours(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Min: 1 hour</span>
                  <span>Max: 50 hours</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Payment Proof</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  {previewUrl ? (
                    <div className="space-y-2">
                      <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                        <img
                          src={previewUrl}
                          alt="Payment proof"
                          className="h-auto w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPaymentProof(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
                        >
                          Replace
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {paymentProof?.name}
                      </p>
                    </div>
                  ) : (
                    <label
                      htmlFor="file"
                      className="flex flex-col items-center justify-center cursor-pointer py-4"
                    >
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">
                        Upload payment screenshot or receipt
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </GlassMorphismCard>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Review your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours</span>
                  <span className="font-medium">{hours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate per hour</span>
                  <span className="font-medium">${hourlyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-lg">${amount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <Info className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Payment Instructions</p>
                    <p className="mt-1">After payment, upload proof and wait for admin approval.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!paymentProof || isSubmitting}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    Submit Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default PaymentRequest;
