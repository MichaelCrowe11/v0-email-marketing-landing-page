import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: tokenData } = await supabase
      .from("github_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .single()

    if (!tokenData) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 401 })
    }

    const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/.]+)/)
    if (!repoMatch) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    const [, owner, repo] = repoMatch
    const repoFullName = `${owner}/${repo}`

    const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!repoResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch repository" }, { status: 400 })
    }

    const repoData = await repoResponse.json()

    const treeResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/git/trees/${repoData.default_branch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    const treeData = await treeResponse.json()

    const { data: repoRecord, error: repoError } = await supabase
      .from("github_repositories")
      .insert({
        user_id: user.id,
        repo_full_name: repoFullName,
        repo_url: repoData.html_url,
        default_branch: repoData.default_branch,
        last_synced_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (repoError) {
      console.error("[v0] Failed to store repository:", repoError)
      return NextResponse.json({ error: "Failed to clone repository" }, { status: 500 })
    }

    const files = treeData.tree.filter((item: any) => item.type === "blob" && item.size < 1000000)

    const filePromises = files.slice(0, 50).map(async (file: any) => {
      try {
        const contentResponse = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${file.path}`, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: "application/vnd.github.v3.raw",
          },
        })

        const content = await contentResponse.text()

        return {
          user_id: user.id,
          repository_id: repoRecord.id,
          file_path: file.path,
          content,
          language: file.path.split(".").pop() || "text",
        }
      } catch (error) {
        console.error(`[v0] Failed to fetch file ${file.path}:`, error)
        return null
      }
    })

    const fileContents = (await Promise.all(filePromises)).filter(Boolean)

    if (fileContents.length > 0) {
      await supabase.from("workspace_files").insert(fileContents)
    }

    return NextResponse.json({
      success: true,
      repository: repoRecord,
      filesCloned: fileContents.length,
    })
  } catch (error) {
    console.error("[v0] Clone repository error:", error)
    return NextResponse.json({ error: "Failed to clone repository" }, { status: 500 })
  }
}
