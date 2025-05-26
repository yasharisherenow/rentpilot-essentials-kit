
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  Search,
  Filter,
  Calendar,
  User,
  Home,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

type Lease = {
  id: string;
  tenant_name: string;
  property_title: string;
  monthly_rent: number;
  lease_start_date: string;
  lease_end_date: string;
  status: 'active' | 'expiring' | 'archived';
  created_at: string;
  document_url?: string;
};

type LeaseManagementProps = {
  leases: Lease[];
  onPreviewLease: (leaseId: string) => void;
  onDownloadLease: (leaseId: string) => void;
  onDuplicateLease: (leaseId: string) => void;
};

const LeaseManagement = ({ 
  leases, 
  onPreviewLease, 
  onDownloadLease, 
  onDuplicateLease 
}: LeaseManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'archived'>('all');

  const getStatusBadge = (status: Lease['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-700', label: 'Active' },
      expiring: { color: 'bg-amber-100 text-amber-700', label: 'Expiring Soon' },
      archived: { color: 'bg-gray-100 text-gray-700', label: 'Archived' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.property_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lease.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lease Management</h2>
          <p className="text-gray-600">Manage all your lease agreements in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#FFD500]/20 text-[#0C6E5F]">
            {filteredLeases.length} Leases
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by tenant or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lease Table */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Tenant</TableHead>
              <TableHead className="font-semibold">Property</TableHead>
              <TableHead className="font-semibold">Rent</TableHead>
              <TableHead className="font-semibold">Lease Period</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeases.map(lease => (
              <TableRow key={lease.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#0C6E5F] rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {lease.tenant_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{lease.tenant_name}</div>
                      <div className="text-xs text-gray-500">
                        Since {formatDate(lease.lease_start_date)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Home size={14} className="text-gray-400" />
                    <span className="font-medium">{lease.property_title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-[#0C6E5F] font-medium">
                    <DollarSign size={14} />
                    <span>${lease.monthly_rent}/mo</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={12} className="text-gray-400" />
                      <span>{formatDate(lease.lease_start_date)} - {formatDate(lease.lease_end_date)}</span>
                    </div>
                    {isExpiringSoon(lease.lease_end_date) && (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <AlertTriangle size={10} />
                        <span>Expires in {Math.ceil((new Date(lease.lease_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(lease.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewLease(lease.id)}
                      className="p-2 h-auto hover:bg-[#0C6E5F]/5"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadLease(lease.id)}
                      className="p-2 h-auto hover:bg-[#0C6E5F]/5"
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicateLease(lease.id)}
                      className="p-2 h-auto hover:bg-[#0C6E5F]/5"
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLeases.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Leases Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first lease agreement'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LeaseManagement;
