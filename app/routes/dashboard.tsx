import { useLoaderData } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { getDashboardSummary } from '~/services/analytics.server';
import { requireAuth } from '~/services/auth.server';
import { TicketStatistics } from '~/components/dashboard/TicketStatistics';
import { AgentPerformance } from '~/components/dashboard/AgentPerformance';
import { LanguageDistribution } from '~/components/dashboard/LanguageDistribution';
import type { Route } from '../+types/root';

export async function loader(args: Route.LoaderArgs) {
  // Ensure user is authenticated and has appropriate permissions
  await requireAuth(args, ['ADMIN', 'REPRESENTATIVE']);

  // Get dashboard data
  const dashboardData = await getDashboardSummary();

  return { dashboardData };
}

export default function Dashboard() {
  const { dashboardData } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Open Tickets</CardTitle>
            <CardDescription>Current active tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.openTickets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Tickets</CardTitle>
            <CardDescription>All-time tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dashboardData.totalTickets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resolution Rate</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.ticketMetrics.length > 0 ? (
              <p className="text-4xl font-bold">
                {Math.round(
                  (dashboardData.ticketMetrics.reduce((sum: number, day: any) => sum + day.resolvedTickets, 0) /
                    Math.max(dashboardData.ticketMetrics.reduce((sum: number, day: any) => sum + day.newTickets, 0), 1)) *
                  100
                )}%
              </p>
            ) : (
              <p className="text-4xl font-bold">0%</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStatistics data={dashboardData.ticketMetrics} />
        <AgentPerformance data={dashboardData.agentPerformance} />
        <LanguageDistribution data={dashboardData.languageMetrics} />
      </div>
    </div>
  );
} 