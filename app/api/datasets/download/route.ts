import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { BlobServiceClient } from "@azure/storage-blob"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Download token is required" }, { status: 400 })
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify download token and get purchase info
    const { data: purchase, error } = await supabase
      .from("dataset_purchases")
      .select("*")
      .eq("download_token", token)
      .eq("user_id", user.id)
      .single()

    if (error || !purchase) {
      return NextResponse.json({ error: "Invalid download token" }, { status: 404 })
    }

    // Check if download limit reached
    if (purchase.download_count >= purchase.max_downloads) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 403 })
    }

    // Check if expired
    if (new Date(purchase.expires_at) < new Date()) {
      return NextResponse.json({ error: "Download link has expired" }, { status: 403 })
    }

    // Generate Azure Blob SAS URL
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connectionString) {
      console.error("Azure Storage connection string not configured")
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerName = purchase.metadata?.azureBlobContainer || `dataset-${purchase.dataset_id}`
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Generate SAS token for container (valid for 24 hours)
    const startsOn = new Date()
    const expiresOn = new Date(startsOn.valueOf() + 24 * 60 * 60 * 1000)

    const sasUrl = await containerClient.generateSasUrl({
      permissions: "r", // read only
      startsOn,
      expiresOn,
    })

    // Update download count
    await supabase
      .from("dataset_purchases")
      .update({ download_count: purchase.download_count + 1 })
      .eq("id", purchase.id)

    // Log download
    await supabase.from("dataset_download_logs").insert({
      purchase_id: purchase.id,
      user_id: user.id,
      dataset_id: purchase.dataset_id,
      success: true,
    })

    return NextResponse.json({
      downloadUrl: sasUrl,
      expiresIn: "24 hours",
      downloadsRemaining: purchase.max_downloads - purchase.download_count - 1,
    })
  } catch (error: any) {
    console.error("Dataset download error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
