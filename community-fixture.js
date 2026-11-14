defineProvider({
  id: 'community-fixture',
  name: 'Community Fixture',
  endpoints: ['https://example.com'],
  settings: [{ key: 'MODE', title: 'Fixture mode', subtitle: 'Leave empty for success; enter fail for a synthetic refresh error.', type: 'plain' }],
  icon: { monogram: 'CP', tint: '#249E6B' },
  async fetchUsage(ctx) {
    const mode = ctx.settings.get('MODE') || 'success';
    ctx.log('[community-proof] fetch mode=' + mode + ' supportsCostUsageV2=' + (ctx.env.supportsCostUsageV2 === true));
    if (mode === 'fail') throw new Error('Synthetic fixture refresh failure');
    const anchor = ctx.date.now().getTime() + 8 * 60 * 60 * 1000;
    const key = (offset) => new Date(anchor + offset * 86400000).toISOString().slice(0, 10);
    const snapshot = {
      primary: { usedPercent: 42, windowMinutes: 300 },
      details: [{ title: 'Synthetic fixture', rows: [{ label: 'Tokens', value: '1,500' }] }],
      dataConfidence: 'exact'
    };
    if (ctx.env.supportsCostUsageV2 === true) {
      snapshot.costUsage = {
        version: 2, timeZone: 'Asia/Shanghai', windowStart: key(-29), windowEnd: key(0),
        entries: [
          { date: key(-3), totalTokens: '1200', inputTokens: '1000', outputTokens: '200', cacheReadTokens: '400', cacheCreationTokens: '20' },
          { date: key(-1), totalTokens: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 },
          { date: key(0), totalTokens: '300', inputTokens: '250', outputTokens: '50', cacheReadTokens: '100', cacheCreationTokens: 0 }
        ]
      };
    }
    ctx.log('[community-proof] return quota=42 tokens=1500 v2=' + (snapshot.costUsage ? 'true' : 'false'));
    return snapshot;
  }
});
