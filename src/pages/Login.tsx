
import React, { useState } from "react";
import { Role } from "@/types";
import RoleSelection from "@/components/auth/RoleSelection";
import LoginForm from "@/components/auth/LoginForm";
import Navbar from "@/components/shared/Navbar";
import PageTransition from "@/components/shared/PageTransition";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent/20">
      <Navbar />
      
      <PageTransition className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sign in to access your daycare membership dashboard
          </p>
        </div>
        
        {!selectedRole ? (
          <>
            <h2 className="text-xl font-medium mb-6">Select your role to continue</h2>
            <RoleSelection
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />
          </>
        ) : (
          <LoginForm selectedRole={selectedRole} />
        )}
        
        {selectedRole && (
          <button
            onClick={() => setSelectedRole(null)}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back to role selection
          </button>
        )}
      </PageTransition>
    </div>
  );
};

export default Login;
