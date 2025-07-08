# Gemma 3n Integration Guide

This document provides comprehensive guidance on integrating Google's Gemma 3n model with the HealthQuery AI frontend.

## Overview

The frontend is already structured to easily integrate with a Gemma 3n backend. The `HealthAIService` class in `src/services/healthAI.ts` provides a clean abstraction layer that can connect to your Gemma 3n implementation.

## Option 1: API Integration (Recommended)

### Using Google AI Studio

1. **Set up Google AI Studio**:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new project and get your API key
   - Enable the Gemini API for your project

2. **Configure the endpoint**:
   ```typescript
   // In your app initialization
   import { healthAI } from './services/healthAI';
   
   healthAI.configureEndpoint('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');
   ```

3. **Update the API call** in `healthAI.ts`:
   ```typescript
   private async queryGemma3n(request: HealthQueryRequest): Promise<HealthQueryResponse> {
     const response = await fetch(this.apiEndpoint!, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${YOUR_API_KEY}`
       },
       body: JSON.stringify({
         contents: [{
           parts: [{
             text: `You are a helpful health assistant. Provide accurate, general health information. Always include appropriate medical disclaimers. Question: ${request.query}`
           }]
         }]
       })
     });
   }
   ```

## Option 2: Local Backend with Flask

### 1. Create a Flask Backend

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)
CORS(app)

# Load Gemma 3n model
model_name = "google/gemma-2b-it"  # or gemma-7b-it for larger model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    device_map="auto"
)

@app.route('/health/query', methods=['POST'])
def query_health():
    data = request.json
    query = data.get('query', '')
    
    # Create health-focused prompt
    prompt = f"""You are a helpful health information assistant. Provide accurate, evidence-based health information while always emphasizing that this should not replace professional medical advice.

Question: {query}

Response:"""
    
    # Tokenize and generate
    inputs = tokenizer(prompt, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=150,
            temperature=0.7,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    answer = response.split("Response:")[-1].strip()
    
    return jsonify({
        'answer': answer,
        'confidence': 0.8,
        'sources': ['Gemma 3n AI Model'],
        'disclaimer': 'This information is provided by AI and should not replace professional medical advice.'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### 2. Install Dependencies

```bash
pip install torch transformers flask flask-cors accelerate
```

### 3. Configure Frontend

```typescript
// Configure the API endpoint to point to your local Flask server
healthAI.configureEndpoint('http://localhost:5000/health/query');
```

## Option 3: Node.js Backend

### 1. Create a Node.js Backend

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { pipeline } = require('@xenova/transformers');

const app = express();
app.use(cors());
app.use(express.json());

let generator;

// Initialize the model
async function initializeModel() {
  generator = await pipeline('text-generation', 'google/gemma-2b-it');
}

app.post('/health/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    const prompt = `You are a helpful health information assistant. Provide accurate, evidence-based health information while always emphasizing that this should not replace professional medical advice.

Question: ${query}

Response:`;

    const result = await generator(prompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      do_sample: true,
    });

    const answer = result[0].generated_text.split('Response:')[1]?.trim() || 
                  'I apologize, but I cannot provide a response to that query.';

    res.json({
      answer,
      confidence: 0.8,
      sources: ['Gemma 3n AI Model'],
      disclaimer: 'This information is provided by AI and should not replace professional medical advice.'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

initializeModel().then(() => {
  app.listen(3001, () => {
    console.log('Health AI server running on port 3001');
  });
});
```

### 2. Install Dependencies

```bash
npm install express cors @xenova/transformers
```

## Option 4: Fully Offline with WASM

For a completely offline solution, you can use ONNX.js or WebAssembly versions of Gemma:

1. **Convert Gemma to ONNX format**
2. **Use ONNX.js in the browser**:

```typescript
// Add to package.json
"onnxruntime-web": "^1.16.0"

// In your service
import * as ort from 'onnxruntime-web';

export class OfflineHealthAI {
  private session: ort.InferenceSession | null = null;

  async initialize() {
    this.session = await ort.InferenceSession.create('/models/gemma-3n.onnx');
  }

  async query(text: string) {
    // Implement ONNX inference here
  }
}
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_HEALTH_AI_ENDPOINT=http://localhost:5000/health/query
VITE_GOOGLE_AI_KEY=your_google_ai_key_here
```

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement rate limiting on your backend
3. **Input Validation**: Sanitize all user inputs
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS properly for your domain

## Performance Optimization

1. **Model Quantization**: Use quantized models for faster inference
2. **Caching**: Implement response caching for common queries
3. **Batch Processing**: Process multiple queries together when possible
4. **GPU Acceleration**: Use CUDA or Metal for faster inference

## Testing Your Integration

1. **Start your backend** (Flask, Node.js, or API)
2. **Configure the endpoint** in the frontend
3. **Test with sample queries**:
   - "What are the benefits of regular exercise?"
   - "How much water should I drink daily?"
   - "What are the signs of dehydration?"

The frontend will automatically switch from mock responses to your real Gemma 3n implementation once configured.

## Deployment

### For Local Backend:
- Use Docker to containerize your backend
- Deploy to cloud services like AWS, GCP, or Azure
- Set up proper logging and monitoring

### For API Integration:
- Update environment variables for production
- Implement proper error handling and fallbacks
- Monitor API usage and costs

## Support

For issues with Gemma 3n integration:
1. Check the [Hugging Face Transformers documentation](https://huggingface.co/docs/transformers)
2. Review [Google AI documentation](https://ai.google.dev/)
3. Test with the mock responses first to ensure frontend functionality

The frontend is designed to gracefully handle both mock and real AI responses, making the integration process smooth and testable.