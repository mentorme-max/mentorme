export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message, memory } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ reply: 'API key not configured on server.' });
    return;
  }

  const systemPrompt = buildSystemPrompt(memory);
  const fullPrompt = systemPrompt + '\n\nThe person just said: "' + message + '"\n\nRespond now as MentorMe. Be warm, brief, and ask only one question.';

  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300
          }
        })
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      res.status(200).json({ reply: 'Something went wrong with the AI. Error: ' + data.error.message });
      return;
    }

    const reply =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text
        ? data.candidates[0].content.parts[0].text
        : 'I am here with you. Could you tell me a little more about that?';

    res.status(200).json({ reply: reply });

  } catch (err) {
    res.status(200).json({ reply: 'Connection issue: ' + String(err) });
  }
}

function buildSystemPrompt(memory) {
  let context = 'Nothing collected yet.';

  if (memory) {
    const parts = [];
    if (memory.problem) parts.push('Problem: ' + memory.problem);
    if (memory.goal) parts.push('Goal: ' + memory.goal);
    if (memory.rootCause) parts.push('Root cause: ' + memory.rootCause);
    if (memory.currentSituation) parts.push('Current situation: ' + memory.currentSituation);
    if (memory.skills) parts.push('Strengths: ' + memory.skills);
    if (memory.resources) parts.push('Resources: ' + memory.resources);
    if (memory.challenges) parts.push('Biggest obstacle: ' + memory.challenges);
    if (memory.priorities) parts.push('Priority: ' + memory.priorities);
    if (memory.emotion) parts.push('Emotional tone: ' + memory.emotion);
    if (memory.topic) parts.push('Topic area: ' + memory.topic);
    if (parts.length > 0) context = parts.join('\n');
  }

  return `You are MentorMe, a wise, calm, emotionally intelligent personal mentor.

You are NOT a chatbot, therapist, questionnaire, or AI assistant.
You speak like a real human mentor who has helped many people.
You never ask robotic survey questions.
Every question helps the person discover something about themselves.
Always briefly acknowledge what they just said before asking your next question.
Keep your response short — 2 to 5 sentences maximum.
Ask only ONE question per response.
Never repeat a question that has already been answered.
Speak naturally, warmly, and directly.

What you already know about this person:
${context}`;
          }
