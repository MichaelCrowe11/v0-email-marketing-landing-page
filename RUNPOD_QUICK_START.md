# Crowe Logic Mini - Quick Start Guide

## One-Command Setup

### Step 1: Connect to RunPod

1. Go to https://runpod.io/console/pods
2. Find your pod: **n0d8tmzfz3hj65**
3. Click "Connect" → "Start Web Terminal" or "Connect via SSH"

### Step 2: Run Auto-Setup

Copy and paste this single command:

\`\`\`bash
curl -sSL https://raw.githubusercontent.com/YOUR_REPO/main/scripts/runpod-training/auto-setup.sh | bash
\`\`\`

**OR** if you have the script locally:

\`\`\`bash
cd /workspace
wget YOUR_SCRIPT_URL/auto-setup.sh
chmod +x auto-setup.sh
./auto-setup.sh
\`\`\`

**OR** manually paste the script:

\`\`\`bash
cd /workspace
nano auto-setup.sh
# Paste the script content, then Ctrl+X, Y, Enter
chmod +x auto-setup.sh
./auto-setup.sh
\`\`\`

### Step 3: Add Your Training Data (Optional)

The script creates example data, but for best results add your own:

\`\`\`bash
cd /workspace/crowe-logic-mini
nano dataset.jsonl
\`\`\`

Add your examples in this format:
\`\`\`json
{"instruction": "Your question or task", "output": "The detailed answer"}
{"instruction": "Another question", "output": "Another answer"}
\`\`\`

### Step 4: Start Training

\`\`\`bash
cd /workspace/crowe-logic-mini
python train.py
\`\`\`

**Training time:** 2-3 hours for 3B model with example data

### Step 5: Deploy Inference Server

After training completes:

\`\`\`bash
python serve.py
\`\`\`

### Step 6: Expose Endpoint

1. In RunPod dashboard, click "Edit" on pod **n0d8tmzfz3hj65**
2. Under "Expose HTTP Ports", add: `8000`
3. Save and copy the generated URL

### Step 7: Connect to Platform

Add to Vercel environment variables:

\`\`\`
RUNPOD_ENDPOINT=https://n0d8tmzfz3hj65-8000.proxy.runpod.net
RUNPOD_API_KEY=your-runpod-api-key
\`\`\`

## Testing

Test locally on RunPod:
\`\`\`bash
curl http://localhost:8000/health
\`\`\`

Test from your platform:
\`\`\`bash
curl https://n0d8tmzfz3hj65-8000.proxy.runpod.net/health
\`\`\`

## Monitoring

Watch training progress:
\`\`\`bash
tail -f /workspace/crowe-logic-mini/training.log
\`\`\`

## Troubleshooting

**Out of memory?**
- Edit `train.py` and reduce `per_device_train_batch_size` to 2 or 1

**Model not loading?**
- Run: `huggingface-cli login` and enter your HF token

**Port not accessible?**
- Verify port 8000 is exposed in RunPod dashboard
- Check firewall settings

## Support

Email: michael@crowelogic.com
Pod ID: n0d8tmzfz3hj65
