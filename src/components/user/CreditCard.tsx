
import React from "react";
import { Member } from "@/types";
import { Moon, CreditCard as CreditCardIcon, Cpu } from "lucide-react";

interface CreditCardProps {
  member: Member;
}

const CreditCard = ({ member }: CreditCardProps) => {
  return (
    <div className="credit-card p-6 w-full max-w-md mx-auto relative overflow-hidden bg-gradient-to-br from-blue-950/90 to-indigo-900/90 shadow-xl rounded-xl backdrop-blur-sm border border-white/10">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center space-x-2">
          <Moon className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-bold text-white/90">RFID Daycare</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/60">Membership</span>
          <span className="text-sm font-semibold text-white/90">Premium</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-400/80 to-yellow-600/80 flex items-center justify-center">
          <Cpu className="h-5 w-5 text-white/90" />
        </div>
        <div className="font-mono text-xl tracking-wider text-white/90">
          {member.rfidNumber}
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs uppercase text-white/60 mb-1">Card Holder</div>
          <div className="text-white font-medium tracking-wide">{member.name}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs uppercase text-white/60 mb-1">Hours</div>
          <div className="text-white font-medium">
            {member.membershipHours - member.totalHoursUsed} / {member.membershipHours}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-2 opacity-30">
        <CreditCardIcon className="h-8 w-8 text-blue-400" />
      </div>
      
      {/* Add subtle visual elements for glassmorphism effect */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-xl"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-xl"></div>
    </div>
  );
};

export default CreditCard;
