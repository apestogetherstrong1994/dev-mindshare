import Section from '../layout/Section';

const SOURCES = [
  { source: 'npm Registry API', url: 'api.npmjs.org/downloads/range/', data: 'Package download counts (daily, weekly, monthly)', date: '2026-03-13', caveats: 'Public, unauthenticated. ~1000 req/hr rate limit.' },
  { source: 'PyPI Stats API', url: 'pypistats.org/api/', data: 'Python package download counts', date: '2026-03-13', caveats: 'Public, unauthenticated. Excludes mirror traffic.' },
  { source: 'GitHub REST API', url: 'api.github.com/repos/', data: 'Stars, forks, issues, watchers', date: '2026-03-13', caveats: '60 req/hr unauthenticated. Snapshot values only.' },
  { source: 'HN Algolia API', url: 'hn.algolia.com/api/v1/search', data: 'Story submissions, points, comments', date: '2026-03-13', caveats: 'Search term matching may include false positives.' },
  { source: 'Stack Exchange API', url: 'api.stackexchange.com/2.3/', data: 'Question counts by tag', date: '2026-03-13', caveats: 'Tag coverage varies. "anthropic" tag has very few questions.' },
  { source: 'Reddit JSON API', url: 'reddit.com/r/{sub}/about.json', data: 'Subscriber counts', date: '2026-03-13', caveats: 'Active user counts unavailable without auth.' },
  { source: 'Job Boards', url: 'LinkedIn, Indeed, Greenhouse', data: 'Approximate job posting counts', date: '2026-03-13', caveats: 'Estimated from search result counts. Inherently approximate.' },
  { source: 'Developer Surveys', url: 'SO Survey, JetBrains, Retool', data: 'Tool usage, satisfaction, preferences', date: '2025 surveys', caveats: 'Self-reported data. 2026 surveys not yet published.' },
  { source: 'Google Trends', url: 'trends.google.com', data: 'Relative search interest (0-100)', date: '2026-03-13', caveats: 'Normalized relative scores, not absolute volumes.' },
  { source: 'Twitter/X', url: 'Public profiles', data: 'Official account follower counts', date: '2026-03-13', caveats: 'Follower counts only. Engagement metrics require API access.' },
];

export default function SourcesMethodology() {
  return (
    <Section number={9} title="Sources & Methodology" id="sources">
      <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-terminal-border">
              <th className="py-3 px-4 text-left text-terminal-muted uppercase tracking-widest font-normal">Source</th>
              <th className="py-3 px-4 text-left text-terminal-muted uppercase tracking-widest font-normal">Endpoint / URL</th>
              <th className="py-3 px-4 text-left text-terminal-muted uppercase tracking-widest font-normal">Data Collected</th>
              <th className="py-3 px-4 text-left text-terminal-muted uppercase tracking-widest font-normal">Date</th>
              <th className="py-3 px-4 text-left text-terminal-muted uppercase tracking-widest font-normal">Caveats</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((s, i) => (
              <tr key={i} className="border-b border-terminal-border/50 hover:bg-terminal-elevated/30">
                <td className="py-3 px-4 text-terminal-bright font-semibold">{s.source}</td>
                <td className="py-3 px-4 text-terminal-muted">{s.url}</td>
                <td className="py-3 px-4 text-terminal-text">{s.data}</td>
                <td className="py-3 px-4 text-terminal-muted">{s.date}</td>
                <td className="py-3 px-4 text-terminal-muted text-[10px]">{s.caveats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
        <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Important Notes
        </p>
        <ul className="space-y-2 text-xs font-mono text-terminal-muted leading-relaxed">
          <li>• All data points are from publicly available sources. No proprietary or paywalled data was used.</li>
          <li>• Job posting counts are inherently approximate. Ratios between providers are more meaningful than absolute numbers.</li>
          <li>• Survey data reflects 2025 surveys. 2026 surveys are not yet published at time of compilation.</li>
          <li>• xAI/Grok has limited public SDK presence. "N/A" indicates no published package, not zero downloads.</li>
          <li>• The composite ecosystem score is a directional heuristic, not a definitive ranking. Weights reflect the author's judgment of signal importance.</li>
          <li>• MCP SDK downloads include both first-party (Anthropic) and third-party usage. The protocol is open and adopted by multiple providers.</li>
        </ul>
      </div>
    </Section>
  );
}
