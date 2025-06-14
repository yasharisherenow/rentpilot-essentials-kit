
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageCircle, DollarSign, Calendar, Users } from 'lucide-react';
import LeaseMessaging from '@/components/messaging/LeaseMessaging';
import { formatDate } from 'date-fns';

type Lease = {
  id: string;
  property_id: string;
  tenant_name: string;
  monthly_rent: number;
  security_deposit: number;
  lease_start_date: string;
  lease_end_date: string;
  status: string;
  utilities_included?: string[];
  special_terms?: string;
  has_pets?: boolean;
  snow_grass_responsibility?: string;
  property?: {
    title: string;
    address: string;
    city: string;
    province: string;
  };
};

type LeaseDetailsModalProps = {
  lease: Lease | null;
  isOpen: boolean;
  onClose: () => void;
  isLandlord?: boolean;
};

const LeaseDetailsModal = ({ lease, isOpen, onClose, isLandlord = false }: LeaseDetailsModalProps) => {
  if (!lease) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <FileText size={24} className="text-yellow-400" />
            Lease Details
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {lease.property?.title || 'Property'} - {lease.tenant_name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="details" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              Lease Details
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <MessageCircle size={16} className="mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Status and Basic Info */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  <span>Lease Information</span>
                  <Badge className={getStatusColor(lease.status)}>
                    {lease.status.charAt(0).toUpperCase() + lease.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Property</p>
                  <p className="text-white font-medium">{lease.property?.title}</p>
                  <p className="text-slate-300 text-sm">
                    {lease.property?.address}, {lease.property?.city}, {lease.property?.province}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Tenant</p>
                  <p className="text-white font-medium">{lease.tenant_name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  Financial Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Monthly Rent</p>
                  <p className="text-white font-medium text-lg">${lease.monthly_rent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Security Deposit</p>
                  <p className="text-white font-medium text-lg">${lease.security_deposit.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Lease Dates */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" />
                  Lease Period
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Start Date</p>
                  <p className="text-white font-medium">{formatDate(new Date(lease.lease_start_date), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">End Date</p>
                  <p className="text-white font-medium">{formatDate(new Date(lease.lease_end_date), 'PPP')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Terms */}
            {(lease.utilities_included || lease.special_terms || lease.snow_grass_responsibility) && (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Additional Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lease.utilities_included && lease.utilities_included.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Utilities Included</p>
                      <div className="flex flex-wrap gap-2">
                        {lease.utilities_included.map((utility) => (
                          <Badge key={utility} variant="outline" className="border-slate-600 text-slate-300">
                            {utility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lease.snow_grass_responsibility && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Snow & Grass Responsibility</p>
                      <p className="text-white">{lease.snow_grass_responsibility}</p>
                    </div>
                  )}
                  
                  {lease.has_pets && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Pets</p>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Pets Allowed
                      </Badge>
                    </div>
                  )}
                  
                  {lease.special_terms && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Special Terms</p>
                      <p className="text-white whitespace-pre-wrap">{lease.special_terms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="messages">
            <LeaseMessaging lease={lease} isLandlord={isLandlord} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeaseDetailsModal;
