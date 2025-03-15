
import React, { useState } from "react";
import { Role } from "@/types";
import RoleSelection from "@/components/auth/RoleSelection";
import LoginForm from "@/components/auth/LoginForm";
import PageTransition from "@/components/shared/PageTransition";
import { Moon } from "lucide-react";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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
            Sign in to access your daycare membership dashboard
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
