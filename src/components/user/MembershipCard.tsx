
import React from "react";
import { Member } from "@/types";
import GlassMorphismCard from "@/components/shared/GlassMorphismCard";
import { Clock, UserCheck, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MembershipCardProps {
  member: Member;
}

const MembershipCard = ({ member }: MembershipCardProps) => {
  const usagePercentage = Math.min(
    Math.round((member.totalHoursUsed / member.membershipHours) * 100),
    100
  );
  const hoursRemaining = Math.max(member.membershipHours - member.totalHoursUsed, 0);

  return (
    <GlassMorphismCard 
      className="overflow-hidden" 
      glowEffect 
      hoverEffect
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="relative p-6 z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Membership Card</h3>
            <h2 className="text-2xl font-display font-bold mt-1">{member.name}</h2>
          </div>
          <div className="flex items-center">
            <div className={cn(
              "w-3 h-3 rounded-full mr-2",
              member.isActive ? "bg-green-500" : "bg-red-500"
            )}></div>
            <span className="text-sm font-medium">
              {member.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 text-primary mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">RFID Number</p>
              <p className="font-medium">{member.rfidNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-primary mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Member ID</p>
              <p className="font-medium">{member.id}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium">Hours Usage</span>
            </div>
            <span className="text-sm font-bold">{member.totalHoursUsed} / {member.membershipHours}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
        
        <div className="mt-4 bg-primary/10 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Hours Remaining</p>
            <p className="text-2xl font-bold">{hoursRemaining}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Hours Used</p>
            <p className="text-lg font-medium">{member.totalHoursUsed}</p>
          </div>
        </div>
      </div>
    </GlassMorphismCard>
  );
};

export default MembershipCard;
