import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

async function pushFileToGitHub(
  token: string,
  repo: string,
  branch: string,
  filePath: string,
  contentStr: string,
  commitMessage: string
) {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;

  let currentSha: string | undefined;
  const getRes = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "AniimoPower-CMS",
    },
  });

  if (getRes.ok) {
    const data = await getRes.json();
    currentSha = data.sha;
  }

  const base64Content = Buffer.from(contentStr, "utf-8").toString("base64");

  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "AniimoPower-CMS",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      sha: currentSha,
      branch: branch,
    }),
  });

  if (!putRes.ok) {
    const errorJson = await putRes.json().catch(() => ({}));
    throw new Error(
      `GitHub API error (${putRes.status}): ${errorJson.message || putRes.statusText}`
    );
  }

  return await putRes.json();
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("aniimo_admin_session")?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { aniimos, heldItems } = body;

    let savedLocally = false;
    let githubSynced = false;
    let githubCommitUrl: string | undefined;

    const aniimosStr = aniimos ? JSON.stringify(aniimos, null, 2) : null;
    const heldItemsStr = heldItems ? JSON.stringify(heldItems, null, 2) : null;

    // 1. Attempt local file write (works in local dev & Node environments)
    try {
      const aniimosPath = path.join(process.cwd(), "src", "data", "aniimos.json");
      const heldItemsPath = path.join(process.cwd(), "src", "data", "held_items.json");

      if (aniimosStr) {
        fs.writeFileSync(aniimosPath, aniimosStr, "utf-8");
      }
      if (heldItemsStr) {
        fs.writeFileSync(heldItemsPath, heldItemsStr, "utf-8");
      }
      savedLocally = true;
    } catch (fsErr) {
      console.warn("Local disk write skipped (likely read-only serverless environment):", fsErr);
    }

    // 2. Attempt GitHub synchronization if GITHUB_TOKEN is present
    const ghToken = process.env.GITHUB_TOKEN?.trim();
    const ghRepo = process.env.GITHUB_REPO || "Yazan4HD/aniimopower";
    const ghBranch = process.env.GITHUB_BRANCH || "main";

    if (ghToken) {
      if (aniimosStr) {
        const result = await pushFileToGitHub(
          ghToken,
          ghRepo,
          ghBranch,
          "src/data/aniimos.json",
          aniimosStr,
          `chore(cms): update aniimos via Aniimo Power CMS [by ${session.username}]`
        );
        githubCommitUrl = result.commit?.html_url;
      }
      if (heldItemsStr) {
        await pushFileToGitHub(
          ghToken,
          ghRepo,
          ghBranch,
          "src/data/held_items.json",
          heldItemsStr,
          `chore(cms): update held items via Aniimo Power CMS [by ${session.username}]`
        );
      }
      githubSynced = true;
    }

    if (!savedLocally && !githubSynced) {
      return NextResponse.json(
        {
          error:
            "Unable to persist changes: server disk is read-only and GITHUB_TOKEN is not configured in Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      savedLocally,
      githubSynced,
      commitUrl: githubCommitUrl,
      message: githubSynced
        ? "Saved and pushed to GitHub! Vercel is now building and deploying the changes."
        : "Saved changes to local project files.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save CMS data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

