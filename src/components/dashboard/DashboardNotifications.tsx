
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Users, 
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

type Notification = {
  id: string;
  type: 'application' | 'lease_expiring' | 'vacant_unit' | 'maintenance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
};

type DashboardNotificationsProps = {
  notifications: Notification[];
  onDismiss: (id: string) => void;
};

const DashboardNotifications = ({ notifications, onDismiss }: DashboardNotificationsProps) => {
  const [collapsed, setCollapsed] = useState(false);

  if (notifications.length === 0) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Users size={16} className="text-blue-600" />;
      case 'lease_expiring':
        return <Calendar size={16} className="text-amber-600" />;
      case 'vacant_unit':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#0C6E5F]" />
          <h3 className="font-medium text-gray-900">Notifications</h3>
          <Badge variant="secondary" className="bg-[#FFD500]/20 text-[#0C6E5F]">
            {notifications.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900"
        >
          {collapsed ? 'Show' : 'Hide'}
        </Button>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Alert 
              key={notification.id} 
              className={`border-l-4 ${getPriorityColor(notification.priority)} shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <AlertDescription className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </AlertDescription>
                    <AlertDescription className="text-gray-600 text-sm">
                      {notification.description}
                    </AlertDescription>
                    {notification.actionLabel && notification.onAction && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={notification.onAction}
                        className="p-0 h-auto mt-2 text-[#0C6E5F] hover:text-[#0C6E5F]/80"
                      >
                        {notification.actionLabel}
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(notification.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                >
                  <X size={14} />
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardNotifications;
