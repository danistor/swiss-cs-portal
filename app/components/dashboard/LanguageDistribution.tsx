import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Language } from '@prisma/client';

interface LanguageData {
  id: string;
  date: string;
  language: Language;
  ticketCount: number;
  messageCount: number;
}

interface LanguageDistributionProps {
  data: LanguageData[];
}

export function LanguageDistribution({ data }: LanguageDistributionProps) {
  // Group data by language
  const languageMap = new Map<Language, { ticketCount: number; messageCount: number }>();

  // Initialize with all languages
  Object.values(Language).forEach(lang => {
    languageMap.set(lang as Language, { ticketCount: 0, messageCount: 0 });
  });

  // Aggregate data
  data.forEach(record => {
    const current = languageMap.get(record.language) || { ticketCount: 0, messageCount: 0 };
    languageMap.set(record.language, {
      ticketCount: current.ticketCount + record.ticketCount,
      messageCount: current.messageCount + record.messageCount,
    });
  });

  // Convert to array and sort by ticket count
  const languageStats = Array.from(languageMap.entries())
    .map(([language, stats]) => ({
      language,
      ...stats,
    }))
    .sort((a, b) => b.ticketCount - a.ticketCount);

  // Calculate totals for percentages
  const totalTickets = languageStats.reduce((sum, lang) => sum + lang.ticketCount, 0);
  const totalMessages = languageStats.reduce((sum, lang) => sum + lang.messageCount, 0);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
        <CardDescription>Distribution of tickets and messages by language</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Ticket Distribution */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tickets by Language</h3>
            <div className="space-y-2">
              {languageStats.map(lang => (
                <div key={lang.language} className="flex items-center">
                  <span className="w-12 text-sm">{getLanguageLabel(lang.language)}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getLanguageColor(lang.language)}`}
                      style={{
                        width: `${calculatePercentage(lang.ticketCount, totalTickets)}%`
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm">
                    {lang.ticketCount} ({calculatePercentage(lang.ticketCount, totalTickets)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Distribution */}
          <div>
            <h3 className="text-sm font-medium mb-2">Messages by Language</h3>
            <div className="space-y-2">
              {languageStats.map(lang => (
                <div key={lang.language} className="flex items-center">
                  <span className="w-12 text-sm">{getLanguageLabel(lang.language)}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getLanguageColor(lang.language)}`}
                      style={{
                        width: `${calculatePercentage(lang.messageCount, totalMessages)}%`
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm">
                    {lang.messageCount} ({calculatePercentage(lang.messageCount, totalMessages)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Legend */}
          <div className="flex flex-wrap gap-3 pt-2 border-t">
            {languageStats.map(lang => (
              <div key={lang.language} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${getLanguageColor(lang.language)}`}></div>
                <span className="text-xs">{getLanguageFullName(lang.language)}</span>
              </div>
            ))}
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

function getLanguageLabel(language: Language): string {
  return language;
}

function getLanguageFullName(language: Language): string {
  switch (language) {
    case 'EN': return 'English';
    case 'DE': return 'German';
    case 'FR': return 'French';
    case 'IT': return 'Italian';
    default: return language;
  }
}

function getLanguageColor(language: Language): string {
  switch (language) {
    case 'EN': return 'bg-blue-500';
    case 'DE': return 'bg-red-500';
    case 'FR': return 'bg-purple-500';
    case 'IT': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
} 