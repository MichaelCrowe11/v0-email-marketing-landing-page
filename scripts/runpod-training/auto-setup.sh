#!/bin/bash
# Crowe Logic Mini - Automated RunPod Training Setup
# Run this script on your RunPod instance to set up everything automatically

set -e  # Exit on any error

echo "🚀 Crowe Logic Mini - Automated Setup"
echo "======================================"
echo ""

# Set working directory
WORKSPACE="/workspace/crowe-logic-mini"
mkdir -p $WORKSPACE
cd $WORKSPACE

echo "📦 Installing dependencies..."
pip install -q torch transformers datasets peft accelerate bitsandbytes wandb trl fastapi uvicorn

echo "✅ Dependencies installed"
echo ""

# Create training script
echo "📝 Creating training script..."
cat > train.py << 'EOF'
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
from trl import SFTTrainer
import os

print("🧠 Crowe Logic Mini Training")
print("=" * 50)

# Configuration
MODEL_NAME = "meta-llama/Llama-3.2-3B-Instruct"
OUTPUT_DIR = "/workspace/crowe-logic-mini/model"
DATASET_PATH = "/workspace/crowe-logic-mini/dataset.jsonl"

print(f"📚 Base Model: {MODEL_NAME}")
print(f"💾 Output: {OUTPUT_DIR}")
print("")

# Load tokenizer and model
print("Loading model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    device_map="auto",
    load_in_4bit=True
)

# Prepare for training
model = prepare_model_for_kbit_training(model)

# LoRA configuration
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)
print(f"✅ Model loaded with LoRA")
print(f"📊 Trainable parameters: {model.print_trainable_parameters()}")
print("")

# Load dataset
print("Loading dataset...")
if os.path.exists(DATASET_PATH):
    dataset = load_dataset('json', data_files=DATASET_PATH, split='train')
    print(f"✅ Loaded {len(dataset)} examples")
else:
    print("⚠️  No dataset found, creating example dataset...")
    # Create example dataset
    examples = [
        {"instruction": "Explain quantum entanglement", "output": "Quantum entanglement is a phenomenon where two particles become correlated in such a way that the quantum state of one particle cannot be described independently of the other..."},
        {"instruction": "What is the scientific method?", "output": "The scientific method is a systematic approach to research consisting of: 1) Observation, 2) Question formation, 3) Hypothesis development, 4) Experimentation, 5) Analysis, 6) Conclusion..."},
    ]
    with open(DATASET_PATH, 'w') as f:
        for ex in examples:
            f.write(json.dumps(ex) + '\n')
    dataset = load_dataset('json', data_files=DATASET_PATH, split='train')
    print(f"✅ Created example dataset with {len(dataset)} examples")

print("")

# Format dataset
def format_instruction(example):
    text = f"### Instruction:\n{example['instruction']}\n\n### Response:\n{example['output']}"
    return {"text": text}

dataset = dataset.map(format_instruction)

# Training arguments
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    save_strategy="epoch",
    logging_steps=10,
    warmup_steps=100,
    optim="paged_adamw_8bit",
)

# Trainer
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    args=training_args,
    tokenizer=tokenizer,
    max_seq_length=2048,
    dataset_text_field="text",
)

print("🏋️ Starting training...")
print("")
trainer.train()

print("")
print("💾 Saving model...")
trainer.save_model(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print("")
print("✅ Training complete!")
print(f"📁 Model saved to: {OUTPUT_DIR}")
EOF

echo "✅ Training script created"
echo ""

# Create inference server
echo "📝 Creating inference server..."
cat > serve.py << 'EOF'
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from typing import List, Optional
import uvicorn

app = FastAPI(title="Crowe Logic Mini API")

# Load model
MODEL_PATH = "/workspace/crowe-logic-mini/model"
print(f"Loading model from {MODEL_PATH}...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    torch_dtype=torch.float16,
    device_map="auto"
)
model.eval()

print("✅ Model loaded and ready!")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7

@app.post("/v1/chat/completions")
async def chat_completion(request: ChatRequest):
    try:
        # Format messages
        prompt = ""
        for msg in request.messages:
            if msg.role == "system":
                prompt += f"System: {msg.content}\n\n"
            elif msg.role == "user":
                prompt += f"### Instruction:\n{msg.content}\n\n### Response:\n"
        
        # Generate
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(
            **inputs,
            max_new_tokens=request.max_tokens,
            temperature=request.temperature,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("### Response:")[-1].strip()
        
        return {
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": response
                }
            }],
            "model": "crowe-logic-mini"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "model": "crowe-logic-mini"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

echo "✅ Inference server created"
echo ""

echo "📝 Creating example dataset..."
cat > dataset.jsonl << 'EOF'
{"instruction": "Explain the concept of entropy in thermodynamics", "output": "Entropy is a measure of disorder or randomness in a system. In thermodynamics, it quantifies the amount of thermal energy unavailable for doing work. The second law of thermodynamics states that entropy in an isolated system always increases over time, leading to the concept of the 'arrow of time'."}
{"instruction": "What is the difference between correlation and causation?", "output": "Correlation indicates a statistical relationship between two variables, while causation means one variable directly causes changes in another. Correlation does not imply causation - two variables can be correlated due to coincidence, a third confounding variable, or reverse causation. Establishing causation requires controlled experiments or rigorous causal inference methods."}
{"instruction": "Describe the process of photosynthesis", "output": "Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in two stages: 1) Light-dependent reactions in the thylakoid membranes capture light energy and produce ATP and NADPH. 2) Light-independent reactions (Calvin cycle) in the stroma use ATP and NADPH to convert CO2 into glucose. The overall equation is: 6CO2 + 6H2O + light → C6H12O6 + 6O2."}
{"instruction": "What is machine learning?", "output": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions. The three main types are: supervised learning (learning from labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error with rewards)."}
{"instruction": "Explain the theory of relativity", "output": "Einstein's theory of relativity consists of two parts: Special relativity (1905) states that the laws of physics are the same for all non-accelerating observers and that the speed of light is constant. This leads to time dilation and length contraction. General relativity (1915) describes gravity not as a force but as a curvature of spacetime caused by mass and energy. Massive objects bend spacetime, causing other objects to follow curved paths."}
EOF

echo "✅ Example dataset created (5 examples)"
echo ""

echo "=" * 50
echo "✅ Setup Complete!"
echo "=" * 50
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Add your training data to: $WORKSPACE/dataset.jsonl"
echo "   Format: {\"instruction\": \"...\", \"output\": \"...\"}"
echo ""
echo "2️⃣  Start training:"
echo "   python train.py"
echo ""
echo "3️⃣  After training, start inference server:"
echo "   python serve.py"
echo ""
echo "4️⃣  Expose port 8000 in RunPod dashboard"
echo ""
echo "5️⃣  Add endpoint to Vercel:"
echo "   RUNPOD_ENDPOINT=https://n0d8tmzfz3hj65-8000.proxy.runpod.net"
echo ""
echo "📧 Questions? Contact: michael@crowelogic.com"
echo ""
