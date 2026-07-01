export default async function handler(req, res) {
  try {
    const response = await fetch(
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

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: String(err?.message ?? err)
    });
  }
}
