
import React from "react";
import { Member } from "@/types";
import { Motion, CreditCard as CreditCardIcon, ChipIcon } from "lucide-react";

interface CreditCardProps {
  member: Member;
}

const CreditCard = ({ member }: CreditCardProps) => {
  return (
    <div className="credit-card p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center space-x-2">
          <Motion className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-bold text-white/90">RFID Daycare</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/60">Membership</span>
          <span className="text-sm font-semibold text-white/90">Premium</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-400/80 to-yellow-600/80 flex items-center justify-center">
          <ChipIcon className="h-5 w-5 text-white/90" />
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
    </div>
  );
};

export default CreditCard;
