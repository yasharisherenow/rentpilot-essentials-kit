
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Home, Users, FileText, DollarSign } from 'lucide-react';

type PortfolioStats = {
  totalRent: number;
  totalProperties: number;
  occupiedUnits: number;
  vacantUnits: number;
  pendingApplications: number;
  activeLeases: number;
  expiringLeases: number;
};

type PortfolioOverviewProps = {
  stats: PortfolioStats;
};

const PortfolioOverview = ({ stats }: PortfolioOverviewProps) => {
  const occupancyRate = stats.totalProperties > 0 
    ? Math.round((stats.occupiedUnits / stats.totalProperties) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-l-4 border-l-[#0C6E5F] shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign size={16} className="text-[#0C6E5F]" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#0C6E5F]">
            ${stats.totalRent.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total potential monthly rent
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Home size={16} className="text-[#0C6E5F]" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProperties}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              {stats.occupiedUnits} occupied
            </Badge>
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
              {stats.vacantUnits} vacant
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#0C6E5F]" />
            Occupancy Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancyRate}%</div>
          <p className="text-xs text-gray-500 mt-1">
            Current portfolio occupancy
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users size={16} className="text-[#0C6E5F]" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Applications</span>
              <Badge variant="outline" className="text-xs">
                {stats.pendingApplications}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expiring Soon</span>
              <Badge variant="outline" className="text-xs text-amber-600">
                {stats.expiringLeases}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
