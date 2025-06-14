
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useMessages = (leaseId?: string) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('messages')
        .select(`
          id,
          lease_id,
          message_read_status!left (
            user_id
          )
        `)
        .neq('sender_id', user.id) // Exclude own messages
        .is('message_read_status.user_id', null); // Messages not marked as read

      if (leaseId) {
        query = query.eq('lease_id', leaseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          message_id: messageId,
          user_id: user.id,
        });

      if (error) throw error;
      fetchUnreadCount(); // Refresh count
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAllAsRead = async (leaseId: string) => {
    if (!user) return;

    try {
      // Get all unread messages for this lease
      const { data: messages, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('lease_id', leaseId)
        .neq('sender_id', user.id);

      if (fetchError) throw fetchError;

      if (messages && messages.length > 0) {
        const readStatuses = messages.map(msg => ({
          message_id: msg.id,
          user_id: user.id,
        }));

        const { error: insertError } = await supabase
          .from('message_read_status')
          .upsert(readStatuses);

        if (insertError) throw insertError;
        fetchUnreadCount(); // Refresh count
      }
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [leaseId, user]);

  return {
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount: fetchUnreadCount,
  };
};
