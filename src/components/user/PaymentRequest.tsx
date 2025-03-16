
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { paymentService } from "@/services/paymentService";

const pricePerHour = 5; // $5 per hour

const PaymentRequest = () => {
  const { user } = useAuth();
  const [selectedHours, setSelectedHours] = useState(5);
  const [totalPrice, setTotalPrice] = useState(25);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImage && !uploadPreview) {
      toast.error("Please upload a payment screenshot");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit a payment");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await paymentService.submitPaymentRequest({
        memberId: user.id,
        memberName: user.name,
        amount: totalPrice,
        hoursRequested: selectedHours,
        paymentProofImage: uploadedImage || uploadPreview || "",
      });
      
      // Reset form
      setUploadedImage(null);
      setUploadPreview(null);
      setSelectedHours(5);
      setTotalPrice(25);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            disabled={isSubmitting || (!uploadedImage && !uploadPreview)}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Payment Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentRequest;
