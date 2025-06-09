
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Settings, LogOut } from 'lucide-react';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import NotificationPreferences from '@/components/dashboard/NotificationPreferences';
import SubscriptionManagement from '@/components/dashboard/SubscriptionManagement';

const LandlordSettings = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
        >
          <LogOut className="mr-2" size={16} />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandlordSettings;
