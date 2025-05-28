
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  is_read: boolean;
  priority: string;
  created_at: string;
  action_url?: string;
}

const NotificationsDropdown = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application': return '📝';
      case 'lease_expiring': return '⏰';
      case 'maintenance': return '🔧';
      case 'payment_late': return '💰';
      case 'lease_created': return '📋';
      case 'vacancy': return '🏠';
      default: return '📢';
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-200"
      >
        <Bell size={16} />
        <span className="hidden sm:inline">Notifications</span>
        {unreadCount > 0 && (
          <Badge className="bg-yellow-500 text-slate-900 text-xs px-1 ml-1">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-80 z-50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      <Check size={14} className="mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <Bell size={32} className="mx-auto mb-4 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                          !notification.is_read ? 'bg-slate-700/20' : ''
                        }`}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)} mt-2`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{getTypeIcon(notification.type)}</span>
                              <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-white' : 'text-slate-300'}`}>
                                {notification.title}
                              </h4>
                            </div>
                            {notification.description && (
                              <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                                {notification.description}
                              </p>
                            )}
                            <p className="text-xs text-slate-500">
                              {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationsDropdown;
