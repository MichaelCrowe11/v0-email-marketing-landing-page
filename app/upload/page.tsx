import { MushroomDatasetUploader } from "@/components/mushroom-dataset-uploader"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Upload Mushroom Datasets
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your research data and let our AI agents analyze it with quantum-enhanced processing
          </p>
        </div>
        <MushroomDatasetUploader />
      </div>
    </div>
  )
}