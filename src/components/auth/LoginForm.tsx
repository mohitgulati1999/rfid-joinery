
import React, { useState } from "react";
import { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  selectedRole: Role;
}

const LoginForm = ({ selectedRole }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password, selectedRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassMorphismCard className="p-6 w-full max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {selectedRole === "admin" ? "Admin Login" : "Member Login"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50"
            placeholder={selectedRole === "admin" ? "admin@example.com" : "member@example.com"}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 pr-10"
              placeholder={selectedRole === "admin" ? "admin123" : "member123"}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      
      <div className="text-sm text-center mt-4 text-muted-foreground">
        <p>Demo credentials are prefilled in the placeholders</p>
      </div>
    </GlassMorphismCard>
  );
};

export default LoginForm;
