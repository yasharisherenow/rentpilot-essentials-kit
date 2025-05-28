
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Bell, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationPreferences {
  lease_reminders: boolean;
  app_alerts: boolean;
  maintenance_alerts: boolean;
  billing_alerts: boolean;
}

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    lease_reminders: true,
    app_alerts: true,
    maintenance_alerts: true,
    billing_alerts: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
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
        setPreferences({
          lease_reminders: data.lease_reminders,
          app_alerts: data.app_alerts,
          maintenance_alerts: data.maintenance_alerts,
          billing_alerts: data.billing_alerts,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification preferences saved",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Bell size={20} className="text-yellow-400" />
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-slate-400">
          Manage how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300 font-medium">Lease Reminders</Label>
              <p className="text-sm text-slate-500">Get notified about upcoming lease renewals and expirations</p>
            </div>
            <Switch
              checked={preferences.lease_reminders}
              onCheckedChange={(value) => handlePreferenceChange('lease_reminders', value)}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300 font-medium">Application Alerts</Label>
              <p className="text-sm text-slate-500">Receive notifications when new rental applications are submitted</p>
            </div>
            <Switch
              checked={preferences.app_alerts}
              onCheckedChange={(value) => handlePreferenceChange('app_alerts', value)}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300 font-medium">Maintenance Notifications</Label>
              <p className="text-sm text-slate-500">Get alerts for maintenance requests and service updates</p>
            </div>
            <Switch
              checked={preferences.maintenance_alerts}
              onCheckedChange={(value) => handlePreferenceChange('maintenance_alerts', value)}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-300 font-medium">Billing Alerts</Label>
              <p className="text-sm text-slate-500">Receive notifications about payments, invoices, and billing updates</p>
            </div>
            <Switch
              checked={preferences.billing_alerts}
              onCheckedChange={(value) => handlePreferenceChange('billing_alerts', value)}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>

        <Button 
          onClick={savePreferences}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
        >
          <Save size={16} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
