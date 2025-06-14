
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import MessageThread from './MessageThread';

type Lease = {
  id: string;
  tenant_name: string;
  status: string;
  monthly_rent: number;
  property?: {
    title: string;
    address: string;
  };
};

type LeaseMessagingProps = {
  lease: Lease;
  isLandlord?: boolean;
};

const LeaseMessaging = ({ lease, isLandlord = false }: LeaseMessagingProps) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      // Get messages for this lease that don't have a read status for current user
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          message_read_status!left (
            user_id
          )
        `)
        .eq('lease_id', lease.id)
        .neq('sender_id', user.id) // Exclude own messages
        .is('message_read_status.user_id', null); // Messages not marked as read

      if (error) throw error;
      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [lease.id, user]);

  // Only show messaging for active leases
  if (lease.status !== 'active' && lease.status !== 'draft') {
    return (
      <Card className="bg-slate-800/30 border-slate-700/30">
        <CardContent className="p-6 text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-slate-500 opacity-50" />
          <p className="text-slate-400">Messaging is only available for active leases</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Lease Info Header */}
      <Card className="bg-slate-800/30 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Users size={20} className="text-yellow-400" />
            Lease Communication
            {unreadCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/50 ml-auto">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {isLandlord ? (
              <>Communicate with tenant: <span className="text-white font-medium">{lease.tenant_name}</span></>
            ) : (
              <>Communicate with your landlord about this lease</>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Message Thread */}
      <MessageThread 
        leaseId={lease.id}
        tenantName={lease.tenant_name}
        isLandlord={isLandlord}
      />
    </div>
  );
};

export default LeaseMessaging;
