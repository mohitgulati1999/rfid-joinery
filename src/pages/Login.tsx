
import React, { useState } from "react";
import { Role } from "@/types";
import RoleSelection from "@/components/auth/RoleSelection";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PageTransition from "@/components/shared/PageTransition";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleResetView = () => {
    setSelectedRole(null);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
      <PageTransition className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex items-center mb-8">
          <Moon className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-white">
            LaNeenos Daycare
          </h1>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-white/80 max-w-md mx-auto">
            {!selectedRole 
              ? "Sign in or register to access your daycare dashboard" 
              : isLogin 
                ? "Sign in to access your daycare membership dashboard" 
                : "Create a new account to join LaNeenos Daycare"
            }
          </p>
        </div>
        
        {!selectedRole ? (
          <>
            <h2 className="text-xl font-medium mb-6 text-white">Select your role to continue</h2>
            <RoleSelection
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
          </>
        ) : (
          <>
            {isLogin ? (
              <LoginForm selectedRole={selectedRole} />
            ) : (
              <RegisterForm selectedRole={selectedRole} />
            )}
            
            <div className="flex flex-col space-y-2 mt-4 items-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Need an account? Register instead" : "Already have an account? Login instead"}
              </button>
              
              <button
                onClick={handleResetView}
                className="text-sm text-primary/80 hover:underline"
              >
                Back to role selection
              </button>
            </div>
          </>
        )}
      </PageTransition>
    </div>
  );
};

export default Login;
