import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface AgentData {
  id: string;
  userId: string;
  date: string;
  ticketsResolved: number;
  averageResponseTime: number;
  customerSatisfactionScore: number | null;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
}

interface AgentPerformanceProps {
  data: AgentData[];
}

export function AgentPerformance({ data }: AgentPerformanceProps) {
  // Group data by agent
  const agentMap = new Map<string, AgentData[]>();

  data.forEach(record => {
    const agentId = record.userId;
    if (!agentMap.has(agentId)) {
      agentMap.set(agentId, []);
    }
    agentMap.get(agentId)?.push(record);
  });

  // Calculate agent performance metrics
  const agentPerformance = Array.from(agentMap.entries()).map(([agentId, records]) => {
    const name = records[0]?.user.firstName && records[0]?.user.lastName
      ? `${records[0].user.firstName} ${records[0].user.lastName}`
      : `Agent ${agentId.substring(0, 5)}`;

    const totalTicketsResolved = records.reduce((sum, record) => sum + record.ticketsResolved, 0);

    const avgResponseTime = records.length > 0
      ? Math.round(records.reduce((sum, record) => sum + record.averageResponseTime, 0) / records.length)
      : 0;

    const satisfactionScores = records
      .filter(record => record.customerSatisfactionScore !== null)
      .map(record => record.customerSatisfactionScore as number);

    const avgSatisfaction = satisfactionScores.length > 0
      ? Math.round((satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length) * 10) / 10
      : null;

    return {
      agentId,
      name,
      totalTicketsResolved,
      avgResponseTime,
      avgSatisfaction,
    };
  });

  // Sort by tickets resolved (descending)
  agentPerformance.sort((a, b) => b.totalTicketsResolved - a.totalTicketsResolved);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Agent Performance</CardTitle>
        <CardDescription>Last 7 days of agent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agentPerformance.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No agent performance data available</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                <div>Agent</div>
                <div>Tickets Resolved</div>
                <div>Avg. Response</div>
                <div>Satisfaction</div>
              </div>

              {agentPerformance.map(agent => (
                <div key={agent.agentId} className="grid grid-cols-4 text-sm border-t pt-2">
                  <div className="font-medium">{agent.name}</div>
                  <div>{agent.totalTicketsResolved}</div>
                  <div>{agent.avgResponseTime} min</div>
                  <div>
                    {agent.avgSatisfaction !== null ? (
                      <div className="flex items-center">
                        <span className={`mr-1 ${getSatisfactionColor(agent.avgSatisfaction)}`}>
                          {agent.avgSatisfaction.toFixed(1)}
                        </span>
                        <span>/ 5.0</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for satisfaction score color
function getSatisfactionColor(score: number): string {
  if (score >= 4.5) return 'text-green-500';
  if (score >= 4.0) return 'text-green-400';
  if (score >= 3.5) return 'text-yellow-500';
  if (score >= 3.0) return 'text-yellow-400';
  if (score >= 2.5) return 'text-orange-500';
  return 'text-red-500';
} 