import Section from '../layout/Section';

const SOURCES = [
  { source: 'npm Registry API', url: 'api.npmjs.org/downloads/range/', data: 'Daily package download counts (Mar 2025 – Mar 2026)', date: '2026-03-17', caveats: 'Public, unauthenticated. Charts use 7-day rolling average.' },
  { source: 'PyPI Stats API', url: 'pypistats.org/api/', data: 'Python package monthly download counts', date: '2026-03-17', caveats: 'Public. PyPI counts are notoriously inflated by CI/CD, mirrors, and bots.' },
  { source: 'GitHub REST API', url: 'api.github.com/repos/', data: 'Stars, forks, issues, watchers', date: '2026-03-17', caveats: '60 req/hr unauthenticated. Snapshot values only.' },
  { source: 'HN Algolia API', url: 'hn.algolia.com/api/v1/search', data: 'Story submissions, points, comments', date: '2026-03-17', caveats: 'Multiple search terms per provider summed (overlap possible). "claude" alone excluded (matches people named Claude).' },
  { source: 'Stack Exchange API', url: 'api.stackexchange.com/2.3/', data: 'Question counts by tag (comprehensive)', date: '2026-03-17', caveats: 'All relevant tags per provider combined. Anthropic: 9 tags (199 Qs). "opus" (audio codec), "haiku" (Haiku OS), "gemini" (Countersoft) excluded as false positives.' },
  { source: 'Job Boards', url: 'LinkedIn, Indeed', data: 'Approximate job listing counts mentioning provider APIs', date: '2026-03-13', caveats: 'Estimated from search result counts. Inherently approximate. Excluded from composite scoring.' },
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
          <li>• All data points are from publicly available APIs. No proprietary or paywalled data was used.</li>
          <li>• npm download charts use daily data with 7-day rolling average, sampled weekly (~54 data points). This eliminates partial-month artifacts and provides smooth trend visualization.</li>
          <li>• Stack Overflow tag counts are comprehensive (9 tags for Anthropic, 8 for OpenAI, 7 for Google). False-positive tags excluded: "opus" (audio codec), "haiku" (Haiku OS), "gemini" (Countersoft). Upper bounds due to possible multi-tag overlap.</li>
          <li>• Job posting counts are inherently approximate. Ratios between providers are more meaningful than absolute numbers. Excluded from composite scoring.</li>
          <li>• xAI/Grok has limited public SDK presence. "N/A" indicates no published package, not zero downloads.</li>
          <li>• The composite ecosystem score is a directional heuristic, not a definitive ranking. 5 dimensions weighted: SDK Adoption (30%), Discourse (25%), Ecosystem (20%), GitHub (15%), Growth (10%).</li>
          <li>• MCP SDK downloads include both first-party (Anthropic) and third-party usage. PyPI download counts are likely inflated by CI/CD pipelines and mirrors.</li>
          <li>• Reddit community data was collected but excluded from the final dashboard — subscriber counts are a weak proxy for developer adoption and the data was not methodologically rigorous enough to include.</li>
        </ul>
      </div>
    </Section>
  );
}
