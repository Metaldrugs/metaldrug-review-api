export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { name, email, paper, reason } = req.body;

  if (!name || !email || !paper || !reason) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const githubResponse = await fetch(
    "https://api.github.com/repos/Metaldrugs/metaldrug-nda-submissions/dispatches",
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        event_type: "review_request_received",
        client_payload: {
          name,
          email,
          paper,
          reason
        }
      })
    }
  );

  if (githubResponse.ok) {
    return res.status(200).json({
      message: "Review request submitted. NDA will be sent shortly."
    });
  } else {
    const error = await githubResponse.text();
    return res.status(500).json({
      error: "GitHub dispatch failed",
      details: error
    });
  }
}
