import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { TicketPriority, TicketStatus } from '@prisma/client';

interface TicketMetricsData {
  id: string;
  date: string;
  newTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  priorityDistribution: Record<TicketPriority, number> | null;
  statusDistribution: Record<TicketStatus, number> | null;
}

interface TicketStatisticsProps {
  data: TicketMetricsData[];
}

export function TicketStatistics({ data }: TicketStatisticsProps) {
  // Calculate daily averages
  const dailyNewTickets = data.length > 0
    ? Math.round(data.reduce((sum, day) => sum + day.newTickets, 0) / data.length)
    : 0;

  const dailyResolvedTickets = data.length > 0
    ? Math.round(data.reduce((sum, day) => sum + day.resolvedTickets, 0) / data.length)
    : 0;

  const averageResolutionTime = data.length > 0
    ? Math.round(data.reduce((sum, day) => sum + day.averageResolutionTime, 0) / data.length)
    : 0;

  // Aggregate priority distribution
  const priorityDistribution: Record<string, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  // Aggregate status distribution
  const statusDistribution: Record<string, number> = {
    NEW: 0,
    IN_PROGRESS: 0,
    PENDING: 0,
    RESOLVED: 0,
    CLOSED: 0,
  };

  // Combine all data points
  data.forEach(day => {
    if (day.priorityDistribution) {
      Object.entries(day.priorityDistribution).forEach(([priority, count]) => {
        priorityDistribution[priority] = (priorityDistribution[priority] || 0) + count;
      });
    }

    if (day.statusDistribution) {
      Object.entries(day.statusDistribution).forEach(([status, count]) => {
        statusDistribution[status] = (statusDistribution[status] || 0) + count;
      });
    }
  });

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Ticket Statistics</CardTitle>
        <CardDescription>Last 7 days of ticket activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Daily Averages */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">New Tickets/Day</p>
              <p className="text-2xl font-bold">{dailyNewTickets}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Resolved/Day</p>
              <p className="text-2xl font-bold">{dailyResolvedTickets}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Avg. Resolution</p>
              <p className="text-2xl font-bold">{averageResolutionTime} min</p>
            </div>
          </div>

          {/* Priority Distribution */}
          <div>
            <h3 className="text-sm font-medium mb-2">Priority Distribution</h3>
            <div className="space-y-2">
              {Object.entries(priorityDistribution).map(([priority, count]) => (
                <div key={priority} className="flex items-center">
                  <span className="w-24 text-sm">{priority}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPriorityColor(priority as TicketPriority)}`}
                      style={{
                        width: `${calculatePercentage(count, Object.values(priorityDistribution).reduce((a, b) => a + b, 0))}%`
                      }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div>
            <h3 className="text-sm font-medium mb-2">Status Distribution</h3>
            <div className="space-y-2">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <span className="w-24 text-sm">{status.replace('_', ' ')}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(status as TicketStatus)}`}
                      style={{
                        width: `${calculatePercentage(count, Object.values(statusDistribution).reduce((a, b) => a + b, 0))}%`
                      }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function getPriorityColor(priority: TicketPriority): string {
  switch (priority) {
    case 'LOW':
      return 'bg-blue-500';
    case 'MEDIUM':
      return 'bg-yellow-500';
    case 'HIGH':
      return 'bg-orange-500';
    case 'CRITICAL':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function getStatusColor(status: TicketStatus): string {
  switch (status) {
    case 'NEW':
      return 'bg-blue-500';
    case 'IN_PROGRESS':
      return 'bg-yellow-500';
    case 'PENDING':
      return 'bg-purple-500';
    case 'RESOLVED':
      return 'bg-green-500';
    case 'CLOSED':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
} 