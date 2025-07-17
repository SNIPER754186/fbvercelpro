import ytDlp from "yt-dlp-exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Solo POST permitido" });
    return;
  }

  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "Falta el parámetro url" });
    return;
  }

  try {
    const info = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      quiet: true,
      format: "best",
    });

    const videoFormat =
      info.formats.find((f) => f.vcodec !== "none" && f.acodec !== "none") ||
      info.formats[0];

    res.status(200).json({ videoUrl: videoFormat.url, title: info.title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
