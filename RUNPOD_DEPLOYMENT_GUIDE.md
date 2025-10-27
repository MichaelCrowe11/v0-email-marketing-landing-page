# RunPod Deployment Guide for Crowe Logic Mini

## Quick Start

Your RunPod pod is ready: **n0d8tmzfz3hj65**

## Step-by-Step Deployment

### Step 1: Connect to Your Pod

\`\`\`bash
# SSH into your pod (get SSH command from RunPod dashboard)
ssh root@your-pod-ssh-address
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
cd /workspace

# Install required packages
pip install fastapi uvicorn transformers torch accelerate
\`\`\`

### Step 3: Deploy Your Model

After training completes, your model should be in `/workspace/your-model-name`

Create the inference server:

\`\`\`bash
nano /workspace/inference_server.py
\`\`\`

Paste the FastAPI server code from the setup guide.

### Step 4: Start the Server

\`\`\`bash
# Run the server
python /workspace/inference_server.py
\`\`\`

Or use a process manager for production:

\`\`\`bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start "python /workspace/inference_server.py" --name crowe-logic-mini
pm2 save
pm2 startup
\`\`\`

### Step 5: Expose the Port

1. Go to RunPod dashboard
2. Select your pod: **n0d8tmzfz3hj65**
3. Click "Edit"
4. Under "Expose HTTP Ports", add: `8000`
5. Save changes
6. Copy the generated URL (format: `https://n0d8tmzfz3hj65-8000.proxy.runpod.net`)

### Step 6: Test the Endpoint

\`\`\`bash
curl -X POST https://n0d8tmzfz3hj65-8000.proxy.runpod.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are Crowe Logic Mini, a deep reasoning scientific research assistant."},
      {"role": "user", "content": "Explain the concept of emergence in complex systems."}
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'
\`\`\`

### Step 7: Add to Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - `RUNPOD_API_KEY`: Your RunPod API key
   - `RUNPOD_ENDPOINT`: `https://n0d8tmzfz3hj65-8000.proxy.runpod.net`
4. Redeploy your application

## Monitoring

### Check Server Status

\`\`\`bash
# If using PM2
pm2 status
pm2 logs crowe-logic-mini

# Check GPU usage
nvidia-smi

# Check server logs
tail -f /workspace/server.log
\`\`\`

### Performance Metrics

Monitor these in your RunPod dashboard:
- GPU utilization (should be 60-90% during inference)
- Memory usage (should stay under 50GB)
- Request latency (target: <1 second)
- Error rate (target: <0.1%)

## Optimization Tips

### 1. Batch Processing
Enable batching for multiple concurrent requests:

\`\`\`python
# In your inference server
from torch.nn.utils.rnn import pad_sequence

async def batch_inference(requests: list):
    # Batch multiple requests together
    # Process in parallel on GPU
    pass
\`\`\`

### 2. Model Quantization
Reduce memory and increase speed:

\`\`\`python
# Load model with 8-bit quantization
model = AutoModelForCausalLM.from_pretrained(
    "/workspace/your-model",
    load_in_8bit=True,
    device_map="auto"
)
\`\`\`

### 3. KV Cache
Enable key-value caching for faster generation:

\`\`\`python
outputs = model.generate(
    **inputs,
    use_cache=True,  # Enable KV cache
    max_new_tokens=request.max_tokens
)
\`\`\`

## Troubleshooting

### Server Won't Start
\`\`\`bash
# Check Python version
python --version  # Should be 3.10+

# Check CUDA
nvidia-smi

# Check dependencies
pip list | grep torch
\`\`\`

### Out of Memory
\`\`\`bash
# Reduce batch size or use quantization
# Check memory usage
nvidia-smi
\`\`\`

### Slow Inference
\`\`\`bash
# Enable GPU
# Check model is on CUDA
# Use smaller max_tokens
# Enable KV cache
\`\`\`

## Security

### API Key Protection

Add authentication to your inference server:

\`\`\`python
from fastapi import Header, HTTPException

async def verify_token(authorization: str = Header(None)):
    if not authorization or authorization != f"Bearer {RUNPOD_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.post("/v1/chat/completions")
async def chat_completion(
    request: ChatRequest,
    auth: str = Depends(verify_token)
):
    # Your inference code
    pass
\`\`\`

## Next Steps

1. Complete model training
2. Deploy inference server
3. Test endpoint thoroughly
4. Add to Vercel environment variables
5. Monitor performance and costs
6. Iterate on model quality

---

Your custom reasoning model will be live and serving requests within minutes of deployment!
