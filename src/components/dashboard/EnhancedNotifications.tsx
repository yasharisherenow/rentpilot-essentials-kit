import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Users, 
  X,
  ChevronRight,
  Home,
  FileText,
  CreditCard,
  Settings,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useState } from 'react';

type Notification = {
  id: string;
  type: 'application' | 'lease_expiring' | 'vacant_unit' | 'payment' | 'maintenance' | 'system';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  timestamp: string;
  actionLabel?: string;
  actionUrl?: string;
  onAction?: () => void;
  isRead?: boolean;
  metadata?: {
    propertyTitle?: string;
    tenantName?: string;
    amount?: number;
    dueDate?: string;
  };
};

type EnhancedNotificationsProps = {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  showInlineNotifications?: boolean;
};

const EnhancedNotifications = ({ 
  notifications, 
  onDismiss, 
  onMarkAsRead,
  onClearAll,
  showInlineNotifications = true
}: EnhancedNotificationsProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low' | 'urgent'>('all');

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Users size={16} className="text-blue-600" />;
      case 'lease_expiring':
        return <Calendar size={16} className="text-amber-600" />;
      case 'vacant_unit':
        return <Home size={16} className="text-red-600" />;
      case 'payment':
        return <CreditCard size={16} className="text-green-600" />;
      case 'maintenance':
        return <Settings size={16} className="text-purple-600" />;
      case 'system':
        return <Bell size={16} className="text-gray-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getPriorityConfig = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return { 
          color: 'border-l-red-600 bg-red-100', 
          badge: 'bg-red-200 text-red-800',
          dot: 'bg-red-600'
        };
      case 'high':
        return { 
          color: 'border-l-red-500 bg-red-50', 
          badge: 'bg-red-100 text-red-700',
          dot: 'bg-red-500'
        };
      case 'medium':
        return { 
          color: 'border-l-amber-500 bg-amber-50', 
          badge: 'bg-amber-100 text-amber-700',
          dot: 'bg-amber-500'
        };
      default:
        return { 
          color: 'border-l-blue-500 bg-blue-50', 
          badge: 'bg-blue-100 text-blue-700',
          dot: 'bg-blue-500'
        };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => 
    filterPriority === 'all' || notification.priority === filterPriority
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => (n.priority === 'high' || n.priority === 'urgent') && !n.isRead).length;

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Notification Header */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={20} className="text-[#0C6E5F]" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{unreadCount}</span>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {highPriorityCount > 0 && (
                <Badge className="bg-red-100 text-red-700 border-0">
                  {highPriorityCount} urgent
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className="text-gray-600 hover:text-gray-900"
              >
                {collapsed ? 'Show' : 'Hide'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {!collapsed && (
          <CardContent className="pt-0">
            {/* Filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filter:</span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotifications.map((notification) => {
                const priorityConfig = getPriorityConfig(notification.priority);
                
                return (
                  <Alert 
                    key={notification.id} 
                    className={`border-l-4 ${priorityConfig.color} shadow-sm transition-all hover:shadow-md ${!notification.isRead ? 'ring-1 ring-blue-200' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {getIcon(notification.type)}
                          {!notification.isRead && (
                            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertDescription className="font-medium text-gray-900">
                              {notification.title}
                            </AlertDescription>
                            <Badge className={`${priorityConfig.badge} text-xs`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <AlertDescription className="text-gray-600 text-sm mb-2">
                            {notification.description}
                          </AlertDescription>
                          
                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              {notification.metadata.propertyTitle && (
                                <span>Property: {notification.metadata.propertyTitle}</span>
                              )}
                              {notification.metadata.tenantName && (
                                <span>Tenant: {notification.metadata.tenantName}</span>
                              )}
                              {notification.metadata.amount && (
                                <span>Amount: ${notification.metadata.amount}</span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onMarkAsRead(notification.id)}
                                  className="text-xs h-auto p-1"
                                >
                                  <CheckCircle size={12} className="mr-1" />
                                  Mark as read
                                </Button>
                              )}
                              {notification.actionLabel && notification.onAction && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={notification.onAction}
                                  className="p-0 h-auto text-[#0C6E5F] hover:text-[#0C6E5F]/80"
                                >
                                  {notification.actionLabel}
                                  <ChevronRight size={12} className="ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(notification.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 h-auto ml-2"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </Alert>
                );
              })}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications for this filter</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Inline High Priority Notifications */}
      {showInlineNotifications && (
        <div className="space-y-2">
          {notifications
            .filter(n => (n.priority === 'high' || n.priority === 'urgent') && !n.isRead)
            .slice(0, 3)
            .map(notification => (
              <Alert key={`inline-${notification.id}`} className="border-l-4 border-l-red-500 bg-red-50 shadow-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex items-center justify-between flex-1">
                  <div>
                    <AlertDescription className="font-medium text-red-900">
                      {notification.title}
                    </AlertDescription>
                    <AlertDescription className="text-red-700 text-sm">
                      {notification.description}
                    </AlertDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.actionLabel && notification.onAction && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={notification.onAction}
                        className="p-0 h-auto text-red-700 hover:text-red-800"
                      >
                        {notification.actionLabel}
                        <ChevronRight size={12} className="ml-1" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(notification.id)}
                      className="text-red-600 hover:text-red-700 p-1 h-auto"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedNotifications;
