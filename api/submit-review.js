// /api/submit-review.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { name, email, institution } = req.body;

  try {
    const response = await fetch("https://api.github.com/repos/Metaldrugs/metaldrug-nda-submissions/dispatches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PAT}`,
        Accept: "application/vnd.github.everest-preview+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "review_request_received",
        client_payload: {
          name,
          email,
          institution,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    return res.status(200).json({ success: true, message: "Review request submitted to GitHub Actions." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
