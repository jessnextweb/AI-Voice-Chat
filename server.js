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
        { role: 'system', content: 'You are a helpful assistant.' },
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