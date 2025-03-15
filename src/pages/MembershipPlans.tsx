
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { MembershipPlan } from "@/types";
import PageTransition from "@/components/shared/PageTransition";
import { useNavigate } from "react-router-dom";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";

const MembershipPlans = () => {
  const navigate = useNavigate();

  // Example membership plans
  const plans: MembershipPlan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Perfect for occasional visits",
      hoursIncluded: 20,
      pricePerHour: 12,
      totalPrice: 240,
      features: [
        "20 hours of daycare",
        "Basic support",
        "Flexible scheduling",
        "Valid for 3 months",
      ],
    },
    {
      id: "standard",
      name: "Standard Plan",
      description: "Our most popular option",
      hoursIncluded: 50,
      pricePerHour: 10,
      totalPrice: 500,
      features: [
        "50 hours of daycare",
        "Priority support",
        "Flexible scheduling",
        "Special activities included",
        "Valid for 6 months",
      ],
      isPopular: true,
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "For regular users",
      hoursIncluded: 100,
      pricePerHour: 8,
      totalPrice: 800,
      features: [
        "100 hours of daycare",
        "24/7 premium support",
        "Flexible scheduling",
        "All activities included",
        "Special events access",
        "Valid for 12 months",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navbar />
      
      <PageTransition className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect membership plan for your daycare needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="flex flex-col">
              <GlassMorphismCard
                className={`flex flex-col h-full p-6 transition-all duration-300 ${
                  plan.isPopular
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:ring-1 hover:ring-primary/30"
                }`}
                hoverEffect
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <div className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-1">{plan.description}</p>
                </div>
                
                <div className="mt-4 mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-display font-bold">${plan.totalPrice}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.hoursIncluded} hours</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${plan.pricePerHour} per hour
                  </p>
                </div>
                
                <div className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8">
                  <Button
                    className={`w-full ${plan.isPopular ? "" : "bg-primary/90 hover:bg-primary"}`}
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </Button>
                </div>
              </GlassMorphismCard>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">
            Need a Custom Plan?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            We understand that every family has unique needs. Contact us to create a personalized plan.
          </p>
          <Button variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </PageTransition>
    </div>
  );
};

export default MembershipPlans;
