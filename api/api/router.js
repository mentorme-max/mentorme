// ============================================
// MENTORME AI ROUTER
// Tries providers in order. Falls back automatically.
// To add a new provider: add it to PROVIDERS array.
// ============================================

const PROVIDERS = [
  {
    name: 'Groq',
    enabled: true,
    call: callGroq
  },
  {
    name: 'Gemini',
    enabled: true,
    call: callGemini
  }
];

export async function routeToAI(prompt, config) {
  var errors = [];

  for (var i = 0; i < PROVIDERS.length; i++) {
    var provider = PROVIDERS[i];
    if (!provider.enabled) continue;

    try {
      var result = await provider.call(prompt, config);
      if (result && result.text) {
        return {
          text: result.text,
          provider: provider.name,
          success: true
        };
      }
    } catch (err) {
      errors.push(provider.name + ': ' + String(err));
    }
  }

  return {
    text: null,
    success: false,
    errors: errors
  };
}

// ============================================
// GROQ PROVIDER
// Free tier. Fast. Great for real-time chat.
// Get key at: console.groq.com
// ============================================

async function callGroq(prompt, config) {
  var apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  var response = await fetchWithTimeout(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        max_tokens: config.maxTokens || 300,
        temperature: config.temperature || 0.8
      })
    },
    8000
  );

  var data = await response.json();

  if (data.error) throw new Error(data.error.message || 'Groq error');

  var text = data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;

  if (!text) throw new Error('No text from Groq');
  return { text: text.trim() };
}

// ============================================
// GEMINI PROVIDER
// Google Gemini. Free tier available.
// Get key at: aistudio.google.com
// ============================================

async function callGemini(prompt, config) {
  var apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  var fullPrompt = prompt.system + '\n\nUser said: "' + prompt.user + '"';

  var response = await fetchWithTimeout(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: config.temperature || 0.8,
          maxOutputTokens: config.maxTokens || 300
        }
      })
    },
    10000
  );

  var data = await response.json();

  if (data.error) throw new Error(data.error.message || 'Gemini error');

  var text = data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts[0] &&
    data.candidates[0].content.parts[0].text;

  if (!text) throw new Error('No text from Gemini');
  return { text: text.trim() };
}

// ============================================
// UTILITY — fetch with timeout
// ============================================

function fetchWithTimeout(url, options, timeoutMs) {
  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() {
      reject(new Error('Request timed out after ' + timeoutMs + 'ms'));
    }, timeoutMs);

    fetch(url, options)
      .then(function(response) {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(function(err) {
        clearTimeout(timer);
        reject(err);
      });
  });
}
