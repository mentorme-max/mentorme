export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, memory } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'Missing API key on server' });
    return;
  }

  const systemPrompt = buildSystemPrompt(memory);

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + '\n\nUser just said: "' + message + '"\n\nRespond now as MentorMe.' }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
        ? data.candidates[0].content.parts[0].text
        : "I'm here, but I had trouble forming a response just now. Could you say that again?";

    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach Gemini', details: String(err) });
  }
}

function buildSystemPrompt(memory) {
  let context = '';
  if (memory) {
    if (memory.problem) context += 'Problem they shared: ' + memory.problem + '\n';
    if (memory.goal) context += 'Their goal: ' + memory.goal + '\n';
    if (memory.rootCause) context += 'Root cause they identified: ' + memory.rootCause + '\n';
    if (memory.currentSituation) context += 'Current situation: ' + memory.currentSituation + '\n';
    if (memory.skills) context += 'Strengths they have: ' + memory.skills + '\n';
    if (memory.resources) context += 'Resources available: ' + memory.resources + '\n';
    if (memory.challenges) context += 'Biggest obstacle: ' + memory.challenges + '\n';
    if (memory.priorities) context += 'What matters most to them: ' + memory.priorities + '\n';
    if (memory.emotion) context += 'Emotional tone detected: ' + memory.emotion + '\n';
    if (memory.topic) context += 'General topic: ' + memory.topic + '\n';
  }

  return [
    'You are MentorMe, a wise, calm, emotionally intelligent personal mentor.',
    'You are not a chatbot, not a therapist, not a questionnaire, not an AI assistant.',
    'You never ask robotic survey-style questions. Every question should feel thoughtful and help the user discover something about themselves.',
    'Always briefly acknowledge what the user just said before asking the next question, the way a wise mentor would.',
    'Ask only ONE question at a time. Keep responses short — 2 to 5 sentences total.',
    'Never repeat a question whose answer is already known from the context below.',
    'Speak naturally and warmly, never like a form.',
    '',
    'What you already know about this person from earlier in the conversation:',
    context || '(nothing yet — this is early in the conversation)',
    '',
    'Based on everything above, respond to what they just said. Briefly acknowledge it, then ask the next most relevant, emotionally intelligent question to help them move forward.'
  ].join('\n');
}
