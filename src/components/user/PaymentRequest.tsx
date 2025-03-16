
import React, { useState } from "react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Member } from "@/types";
import { CreditCard, Upload, Calculator } from "lucide-react";
import { toast } from "sonner";
import { paymentService } from "@/services/paymentService";

const formSchema = z.object({
  amount: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(1, "Amount must be at least 1")
  ),
  hoursRequested: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().min(1, "Hours must be at least 1")
  ),
  paymentProofImage: z.any()
    .refine((file) => file instanceof File, "Payment proof image is required")
    .refine((file) => file instanceof File && file.size <= 5000000, "Max file size is 5MB")
});

interface PaymentRequestProps {
  member: Member;
  onRequestSubmit?: () => void;
}

const PaymentRequestComponent: React.FC<PaymentRequestProps> = ({ member, onRequestSubmit }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number>(5); // Default hourly rate
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      hoursRequested: 0,
      paymentProofImage: undefined
    }
  });

  const updateAmount = (hours: number) => {
    const amount = hours * hourlyRate;
    form.setValue("amount", amount);
  };

  const updateHours = (amount: number) => {
    const hours = Math.floor(amount / hourlyRate);
    form.setValue("hoursRequested", hours);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("paymentProofImage", file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await paymentService.submitPaymentRequest({
        memberId: member.id,
        memberName: member.name,
        amount: values.amount,
        hoursRequested: values.hoursRequested,
        paymentProofImage: values.paymentProofImage
      });
      
      toast.success("Payment request submitted successfully");
      
      // Reset form
      form.reset();
      setPreviewUrl(null);
      
      // Notify parent component if needed
      if (onRequestSubmit) {
        onRequestSubmit();
      }
    } catch (error) {
      toast.error("Failed to submit payment request");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Request More Hours
        </CardTitle>
        <CardDescription>
          Submit a payment request to add more hours to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hoursRequested"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Requested</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          {...field} 
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(value);
                            if (!isNaN(value)) {
                              updateAmount(value);
                            }
                          }}
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => {
                          const value = (field.value || 0) + 1;
                          field.onChange(value);
                          updateAmount(value);
                        }}
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      How many hours do you want to add?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Pay</FormLabel>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        $
                      </span>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50" 
                          className="rounded-l-none"
                          {...field} 
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(value);
                            if (!isNaN(value)) {
                              updateHours(value);
                            }
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Based on ${hourlyRate} per hour rate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel htmlFor="paymentProof">Payment Proof</FormLabel>
              <div className="mt-2">
                <Label 
                  htmlFor="paymentProof" 
                  className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                >
                  {previewUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Payment proof preview" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <span className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                        Upload payment proof
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                    </span>
                  )}
                </Label>
                <input
                  id="paymentProof"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {form.formState.errors.paymentProofImage && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.paymentProofImage.message as string}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Submit Payment Request</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentRequestComponent;
