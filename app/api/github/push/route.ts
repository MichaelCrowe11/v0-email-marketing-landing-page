import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { repositoryId, commitMessage, files } = await request.json()

    if (!repositoryId || !commitMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [{ data: tokenData }, { data: repoData }] = await Promise.all([
      supabase.from("github_tokens").select("access_token").eq("user_id", user.id).single(),
      supabase.from("github_repositories").select("*").eq("id", repositoryId).eq("user_id", user.id).single(),
    ])

    if (!tokenData || !repoData) {
      return NextResponse.json({ error: "GitHub not connected or repository not found" }, { status: 401 })
    }

    const { data: modifiedFiles } = await supabase
      .from("workspace_files")
      .select("*")
      .eq("repository_id", repositoryId)
      .eq("is_modified", true)

    if (!modifiedFiles || modifiedFiles.length === 0) {
      return NextResponse.json({ error: "No modified files to commit" }, { status: 400 })
    }

    const commitPromises = modifiedFiles.map(async (file) => {
      try {
        const fileResponse = await fetch(
          `https://api.github.com/repos/${repoData.repo_full_name}/contents/${file.file_path}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        )

        const fileData = fileResponse.ok ? await fileResponse.json() : null

        const updateResponse = await fetch(
          `https://api.github.com/repos/${repoData.repo_full_name}/contents/${file.file_path}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              message: commitMessage,
              content: Buffer.from(file.content).toString("base64"),
              sha: fileData?.sha,
              branch: repoData.default_branch,
            }),
          },
        )

        return updateResponse.ok
      } catch (error) {
        console.error(`[v0] Failed to push file ${file.file_path}:`, error)
        return false
      }
    })

    const results = await Promise.all(commitPromises)
    const successCount = results.filter(Boolean).length

    await supabase.from("workspace_files").update({ is_modified: false }).eq("repository_id", repositoryId)

    await supabase.from("git_commits").insert({
      user_id: user.id,
      repository_id: repositoryId,
      commit_message: commitMessage,
      files_changed: modifiedFiles.map((f) => f.file_path),
    })

    return NextResponse.json({
      success: true,
      filesCommitted: successCount,
      totalFiles: modifiedFiles.length,
    })
  } catch (error) {
    console.error("[v0] Push to GitHub error:", error)
    return NextResponse.json({ error: "Failed to push to GitHub" }, { status: 500 })
  }
}
