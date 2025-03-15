
import React from "react";
import { Role } from "@/types";
import { cn } from "@/lib/utils";
import { UserRound, Shield } from "lucide-react";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";

interface RoleSelectionProps {
  selectedRole: Role | null;
  onRoleSelect: (role: Role) => void;
}

const RoleSelection = ({ selectedRole, onRoleSelect }: RoleSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <GlassMorphismCard
        className={cn(
          "p-6 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center",
          selectedRole === "member"
            ? "ring-2 ring-primary/70 shadow-lg shadow-primary/10"
            : "hover:ring-1 hover:ring-primary/30"
        )}
        hoverEffect
        onClick={() => onRoleSelect("member")}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
            selectedRole === "member" ? "bg-primary text-white" : "bg-primary/10 text-primary"
          )}
        >
          <UserRound size={28} />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Member</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Access your daycare membership details, request hours, and manage your profile.
        </p>
      </GlassMorphismCard>

      <GlassMorphismCard
        className={cn(
          "p-6 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center",
          selectedRole === "admin"
            ? "ring-2 ring-primary/70 shadow-lg shadow-primary/10"
            : "hover:ring-1 hover:ring-primary/30"
        )}
        hoverEffect
        onClick={() => onRoleSelect("admin")}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
            selectedRole === "admin" ? "bg-primary text-white" : "bg-primary/10 text-primary"
          )}
        >
          <Shield size={28} />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Admin</h3>
        <p className="mt-2 text-center text-muted-foreground">
          Manage members, track attendance, approve payments, and assign RFID cards.
        </p>
      </GlassMorphismCard>
    </div>
  );
};

export default RoleSelection;
