export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, institution, message } = req.body;

  const githubRes = await fetch("https://api.github.com/repos/Metaldrugs/metaldrug/dispatches", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GH_PAT}`,
      Accept: "application/vnd.github.everest-preview+json"
    },
    body: JSON.stringify({
      event_type: "nda-review-request",
      client_payload: {
        name,
        email,
        institution,
        message,
        timestamp: new Date().toISOString()
      }
    })
  });

  if (githubRes.ok) {
    return res.redirect("https://metaldrug.com/KT-MetalDrug-NDA.pdf");
  } else {
    const err = await githubRes.json();
    return res.status(500).json({ error: "Dispatch failed", details: err });
  }
}
