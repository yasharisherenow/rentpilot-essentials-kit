
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: 'application' | 'lease_expiring' | 'vacant_unit' | 'payment' | 'maintenance' | 'system';
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  action_url?: string;
  metadata: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type cast the database results to ensure proper types
      return (data || []).map(item => ({
        id: item.id,
        type: item.type as Notification['type'],
        title: item.title,
        description: item.description,
        priority: item.priority as Notification['priority'],
        is_read: item.is_read,
        action_url: item.action_url,
        metadata: item.metadata || {},
        created_at: item.created_at,
        expires_at: item.expires_at
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          ...notification
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  },

  subscribeToNotifications(callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as any;
          callback({
            id: newNotification.id,
            type: newNotification.type as Notification['type'],
            title: newNotification.title,
            description: newNotification.description,
            priority: newNotification.priority as Notification['priority'],
            is_read: newNotification.is_read,
            action_url: newNotification.action_url,
            metadata: newNotification.metadata || {},
            created_at: newNotification.created_at,
            expires_at: newNotification.expires_at
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
