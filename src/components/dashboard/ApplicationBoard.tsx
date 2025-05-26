
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { useState } from 'react';

type Application = {
  id: string;
  applicant: string;
  property: string;
  property_id: string;
  date: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  email: string;
  phone: string;
  monthlyIncome?: number;
  moveInDate?: string;
  notes?: string;
};

type ApplicationBoardProps = {
  applications: Application[];
  onStatusChange: (applicationId: string, newStatus: Application['status']) => void;
  onCreateLease: (applicationId: string) => void;
  onViewDetails: (applicationId: string) => void;
};

const ApplicationBoard = ({ 
  applications, 
  onStatusChange, 
  onCreateLease, 
  onViewDetails 
}: ApplicationBoardProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const columns: { status: Application['status']; title: string; color: string }[] = [
    { status: 'new', title: 'New Applications', color: 'bg-blue-50 border-blue-200' },
    { status: 'reviewed', title: 'Under Review', color: 'bg-amber-50 border-amber-200' },
    { status: 'approved', title: 'Approved', color: 'bg-green-50 border-green-200' },
  ];

  const getApplicationsByStatus = (status: Application['status']) => {
    return applications.filter(app => app.status === status);
  };

  const handleDragStart = (applicationId: string) => {
    setDraggedItem(applicationId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Application['status']) => {
    e.preventDefault();
    if (draggedItem) {
      onStatusChange(draggedItem, newStatus);
      setDraggedItem(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Application Tracking</h2>
        <Badge variant="secondary" className="bg-[#FFD500]/20 text-[#0C6E5F]">
          {applications.length} Total Applications
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(column => (
          <div
            key={column.status}
            className={`min-h-[500px] rounded-2xl border-2 border-dashed p-4 ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {getApplicationsByStatus(column.status).length}
              </Badge>
            </div>

            <div className="space-y-3">
              {getApplicationsByStatus(column.status).map(application => (
                <Card
                  key={application.id}
                  draggable
                  onDragStart={() => handleDragStart(application.id)}
                  className="cursor-move hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#0C6E5F] text-white text-xs">
                            {getInitials(application.applicant)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {application.applicant}
                          </CardTitle>
                          <p className="text-xs text-gray-500">{application.property}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(application.id)}
                        className="p-1 h-auto"
                      >
                        <Eye size={14} />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={12} />
                        <span className="truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={12} />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={12} />
                        <span>Applied {formatDate(application.date)}</span>
                      </div>
                      {application.monthlyIncome && (
                        <div className="flex items-center gap-2 text-[#0C6E5F] font-medium">
                          <DollarSign size={12} />
                          <span>${application.monthlyIncome.toLocaleString()}/mo</span>
                        </div>
                      )}
                    </div>

                    {application.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => onCreateLease(application.id)}
                        className="w-full mt-3 bg-[#0C6E5F] hover:bg-[#0C6E5F]/90"
                      >
                        <FileText size={14} className="mr-2" />
                        Create Lease
                      </Button>
                    )}

                    {application.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <strong>Notes:</strong> {application.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {getApplicationsByStatus(column.status).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <User size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applications in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationBoard;
