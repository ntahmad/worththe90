export default async function handler(req, res) {
  try {
    // 1) First update matches/bracket from ESPN
    const matchesResponse = await fetch(
      "https://mccocwpxmxzdoabspimu.supabase.co/functions/v1/sync-matches",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({})
      }
    );

    const matchesText = await matchesResponse.text();
    console.log("sync-matches:", matchesText);

    // 2) Then sync highlight videos
    const highlightsResponse = await fetch(
      "https://mccocwpxmxzdoabspimu.supabase.co/functions/v1/sync-highlights",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          dryRun: false
        })
      }
    );

    const highlightsData = await highlightsResponse.json();

    return res.status(highlightsResponse.status).json({
      ok: highlightsResponse.ok,
      syncMatchesStatus: matchesResponse.status,
      syncMatches: matchesText,
      syncHighlights: highlightsData
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: String(err?.message ?? err)
    });
  }
}
