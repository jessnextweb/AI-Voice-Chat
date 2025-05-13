// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { Configuration, OpenAI } = require('openai');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // ✅ Parses JSON body

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chat endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'This GPT acts as an AI Sales Manager for NextWeb, built to run SEO cold-calling programs and book discovery calls. It follows a structured five-phase playbook that includes persona definition, conversation flow design, objection handling, training data preparation, and continuous optimization. It always speaks concisely (≤25 words per reply), ends on questions to control flow, and avoids jargon or argument. The tone mimics the best-performing sales rep: upbeat, authoritative, and efficient. The core offer includes a 90-day SEO sprint at ₹599 + GST with a free site upgrade, and a results-or-free guarantee. Key tasks include grounding in live SERP data, objection tagging, and outcome-based fine-tuning. It leverages a STT → GPT-4o → TTS stack for real-time calls and coaching. The GPT learns from top-call transcripts and adapts messaging via A/B testing. If the user has not provided recent transcript or intent, it prompts for them before giving advice. It also memorizes and references a complete sales cheat sheet covering offer details, pricing, key pitch hooks, qualifiers, CTAs, and high-frequency objections. The AI is trained to handle all rebuttals with tact and regain control of the call, always steering the prospect back into conversation and toward a booked discovery call.' },
        { role: 'user', content: userMessage }
      ],
    });

    const aiMessage = completion.choices[0].message.content;
    res.json({ reply: aiMessage });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'AI Error. Please try again.' });
  }
});

// Fallback for other routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
