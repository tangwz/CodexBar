defineProvider({
  id: 'nullable-fixture',
  name: 'Nullable Fixture',
  endpoints: ['https://example.com'],
  settings: [],
  icon: { monogram: 'NF', tint: '#249E6B' },
  async fetchUsage(ctx) {
    const anchor = ctx.date.now().getTime() + 8 * 60 * 60 * 1000;
    const key = (offset) => new Date(anchor + offset * 86400000).toISOString().slice(0, 10);
    const snapshot = { primary: { usedPercent: 42, windowMinutes: 300 }, dataConfidence: 'exact' };
    if (ctx.env.supportsCostUsageV2 === true) {
      snapshot.costUsage = {
        version: 2, timeZone: 'Asia/Shanghai', windowStart: key(-29), windowEnd: key(0),
        entries: [
          { date: key(-14), totalTokens: null, requests: null },
          { date: key(-2), totalTokens: '123', requests: 2 },
          { date: key(-1), totalTokens: 0, requests: 0 }
        ]
      };
    }
    ctx.log('[nullable-proof] return unknown=' + key(-14) + ' known=' + key(-2) + ':123/2 zero=' + key(-1) + ':0/0');
    return snapshot;
  }
});
