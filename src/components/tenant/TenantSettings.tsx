
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Lock, 
  Mail, 
  Phone, 
  Save,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type NotificationPreferences = {
  lease_reminders: boolean;
  app_alerts: boolean;
  maintenance_alerts: boolean;
  billing_alerts: boolean;
};

const TenantSettings = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form state
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    lease_reminders: true,
    app_alerts: true,
    maintenance_alerts: true,
    billing_alerts: true,
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
    }
    fetchNotificationPreferences();
  }, [profile]);

  const fetchNotificationPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setNotifications({
          lease_reminders: data.lease_reminders,
          app_alerts: data.app_alerts,
          maintenance_alerts: data.maintenance_alerts,
          billing_alerts: data.billing_alerts,
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...notifications,
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User size={20} className="text-yellow-400" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-slate-400">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              value={profile?.email || ''}
              disabled
              className="bg-slate-700/30 border-slate-600 text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
              placeholder="(555) 123-4567"
            />
          </div>

          <Button
            onClick={handleProfileUpdate}
            disabled={isSaving}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Save size={16} className="mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock size={20} className="text-yellow-400" />
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-400">
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={isSaving || !newPassword || !confirmPassword}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Lock size={16} className="mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell size={20} className="text-yellow-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-400">
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Lease Reminders</label>
                <p className="text-sm text-slate-400">Rent due dates and lease expiration</p>
              </div>
              <Switch
                checked={notifications.lease_reminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, lease_reminders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">App Alerts</label>
                <p className="text-sm text-slate-400">General app notifications</p>
              </div>
              <Switch
                checked={notifications.app_alerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, app_alerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Maintenance Alerts</label>
                <p className="text-sm text-slate-400">Property maintenance updates</p>
              </div>
              <Switch
                checked={notifications.maintenance_alerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, maintenance_alerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Billing Alerts</label>
                <p className="text-sm text-slate-400">Payment confirmations and reminders</p>
              </div>
              <Switch
                checked={notifications.billing_alerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, billing_alerts: checked }))
                }
              />
            </div>
          </div>

          <Button
            onClick={handleNotificationUpdate}
            disabled={isSaving}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Save size={16} className="mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle size={20} className="text-red-400" />
            Account Actions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="text-red-400 font-medium mb-2">Need help?</h4>
            <p className="text-slate-400 text-sm mb-3">
              If you're having issues with your account or need assistance, please contact your landlord or support.
            </p>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/10">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSettings;
