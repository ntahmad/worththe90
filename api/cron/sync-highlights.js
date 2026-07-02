export default async function handler(req, res) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
    };

    // 1) First update matches/bracket from ESPN
    const matchesResponse = await fetch(
      "https://mccocwpxmxzdoabspimu.supabase.co/functions/v1/sync-matches",
      {
        method: "POST",
        headers,
        body: JSON.stringify({})
      }
    );

    const matchesText = await matchesResponse.text();
    console.log("sync-matches:", matchesText);

    // 2) Normal recent/current highlights sync
    const highlightsResponse = await fetch(
      "https://mccocwpxmxzdoabspimu.supabase.co/functions/v1/sync-highlights",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          dryRun: false
        })
      }
    );

    const highlightsData = await highlightsResponse.json();

    // 3) Tiny quota-safe backfill pass
    const backfillResponse = await fetch(
      "https://mccocwpxmxzdoabspimu.supabase.co/functions/v1/sync-highlights",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          dryRun: false,
          backfillMissing: true,
          limit: 3,
          maxSearchApiCalls: 2
        })
      }
    );

    const backfillData = await backfillResponse.json();

    return res.status(highlightsResponse.status).json({
      ok: highlightsResponse.ok,
      syncMatchesStatus: matchesResponse.status,
      syncMatches: matchesText,
      syncHighlights: highlightsData,
      backfillStatus: backfillResponse.status,
      backfill: backfillData
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: String(err?.message ?? err)
    });
  }
}
