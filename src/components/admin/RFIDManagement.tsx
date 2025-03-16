import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Member } from "@/types";
import { NfcIcon, RefreshCw, Link2, Search } from "lucide-react";
import { toast } from "sonner";
import { memberService } from "@/services/memberService";

interface RFIDManagementProps {
  members: Member[];
}

const RFIDManagement: React.FC<RFIDManagementProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scannedRFID, setScannedRFID] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.rfidNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedRFID("");
    
    // Simulate RFID scanning with random generation after 3 seconds
    setTimeout(() => {
      const randomRFID = `RF${Math.floor(100000 + Math.random() * 900000)}`;
      setScannedRFID(randomRFID);
      setIsScanning(false);
      toast.success("RFID card scanned successfully");
    }, 3000);
  };

  const selectMember = (member: Member) => {
    setSelectedMember(member);
  };

  const assignRFID = async () => {
    if (!selectedMember || !scannedRFID) {
      toast.error("Please select a member and scan an RFID card");
      return;
    }

    try {
      await memberService.updateMember(selectedMember.id, { rfidNumber: scannedRFID });
      toast.success(`RFID card ${scannedRFID} assigned to ${selectedMember.name}`);
      setSelectedMember(null);
      setScannedRFID("");
    } catch (error) {
      toast.error("Failed to assign RFID card");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <NfcIcon className="mr-2 h-5 w-5" />
              RFID Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 border rounded-lg flex flex-col items-center justify-center text-center space-y-4">
              {isScanning ? (
                <>
                  <div className="animate-pulse flex flex-col items-center">
                    <NfcIcon className="h-12 w-12 text-primary mb-3" />
                    <p>Scanning for RFID card...</p>
                  </div>
                </>
              ) : scannedRFID ? (
                <>
                  <NfcIcon className="h-12 w-12 text-primary mb-3" />
                  <p className="font-mono text-xl font-bold">{scannedRFID}</p>
                  <p className="text-sm text-muted-foreground">RFID Card Detected</p>
                </>
              ) : (
                <>
                  <NfcIcon className="h-12 w-12 text-muted-foreground mb-3" />
                  <p>No RFID card detected</p>
                  <p className="text-sm text-muted-foreground">
                    Press the button below to scan for a card
                  </p>
                </>
              )}
            </div>
            
            <Button 
              onClick={startScanning} 
              disabled={isScanning} 
              className="w-full"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <NfcIcon className="mr-2 h-4 w-4" />
                  Scan RFID Card
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Link2 className="mr-2 h-5 w-5" />
              Assign RFID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="font-semibold">RFID Card:</div>
                <div className="font-mono">{scannedRFID || "None"}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="font-semibold">Selected Member:</div>
                <div>{selectedMember?.name || "None"}</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-secondary/10">
              <p className="text-sm">
                To assign an RFID card to a member:
              </p>
              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                <li>Scan an RFID card using the scanner</li>
                <li>Select a member from the list below</li>
                <li>Click the "Assign RFID" button</li>
              </ol>
            </div>
            
            <Button 
              onClick={assignRFID} 
              disabled={!scannedRFID || !selectedMember}
              className="w-full"
            >
              Assign RFID to Member
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Current RFID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{member.rfidNumber}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        member.isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => selectMember(member)}
                        disabled={!scannedRFID}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RFIDManagement;
