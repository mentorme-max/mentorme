window.addEventListener('load', function() {
  setTimeout(function() {
    var splash = document.getElementById('splash-screen');
    var app = document.getElementById('app');
    splash.style.transition = 'opacity 1s ease';
    splash.style.opacity = '0';
    setTimeout(function() {
      splash.style.display = 'none';
      app.style.display = 'block';
      loadOnboarding();
    }, 1000);
  }, 3500);
});

function loadOnboarding() {
  var app = document.getElementById('app');
  var current = 0;
  var slides = [
    { icon: '🧭', headline: "You don't have to figure life out alone.", description: "MentorMe helps you think clearly, solve problems, and move forward one conversation at a time." },
    { icon: '💬', headline: "One question at a time.", description: "Your mentor listens first, understands your situation, and guides you step by step." },
    { icon: '🌱', headline: "Your journey starts here.", description: "Career, business, relationships, goals, and life decisions — MentorMe grows with you." }
  ];
  function render() {
    var slide = slides[current];
    var isLast = current === slides.length - 1;
    var dots = '';
    for (var i = 0; i < slides.length; i++) {
      dots += '<span class="ob-dot ' + (i === current ? 'ob-dot-active' : '') + '"></span>';
    }
    app.innerHTML = '<div class="ob-screen"><div class="ob-skip" onclick="loadWelcomeScreen()">Skip</div><div class="ob-content"><div class="ob-icon">' + slide.icon + '</div><h1 class="ob-headline">' + slide.headline + '</h1><p class="ob-description">' + slide.description + '</p></div><div class="ob-footer"><div class="ob-dots">' + dots + '</div><button class="ob-next-btn" onclick="nextSlide()">' + (isLast ? 'Get Started' : 'Next') + '</button></div></div>';
  }
  window.nextSlide = function() {
    if (current < slides.length - 1) { current++; render(); } else { loadWelcomeScreen(); }
  };
  render();
}

function loadWelcomeScreen() {
  var app = document.getElementById('app');
  app.style.overflow = 'auto';
  app.innerHTML = '<div class="welcome-screen"><img src="logo.png" class="welcome-logo" alt="MentorMe" /><p class="welcome-tagline">One honest conversation can change everything.</p><p class="welcome-subtitle">Your personal AI mentor. Ask questions. Get honest guidance. Move forward.</p><div class="welcome-features"><div class="feature-item"><span class="feature-icon">🎯</span><span>Finds your real problem</span></div><div class="feature-item"><span class="feature-icon">💡</span><span>Gives practical advice</span></div><div class="feature-item"><span class="feature-icon">🧠</span><span>Remembers your journey</span></div><div class="feature-item"><span class="feature-icon">🌍</span><span>Available anywhere, anytime</span></div></div><button class="btn-primary" onclick="loadChatScreen()">Start Free Session</button><p class="welcome-login">Already have an account? <span class="link" onclick="alert(\'Login coming soon!\')">Sign in</span></p></div>';
}

/* ============================
   CONVERSATION MEMORY
   ============================ */

var mentorMemory = {
  problem: null,
  goal: null,
  rootCause: null,
  currentSituation: null,
  skills: null,
  resources: null,
  challenges: null,
  priorities: null,
  emotion: null,
  topic: null,
  conversationHistory: []
};

var TOPIC_KEYWORDS = {
  career: ['job', 'career', 'work', 'boss', 'promotion', 'resign', 'interview'],
  money: ['money', 'finance', 'broke', 'salary', 'debt', 'income', 'savings'],
  business: ['business', 'startup', 'company', 'entrepreneur', 'customers', 'product'],
  relationships: ['relationship', 'partner', 'marriage', 'friend', 'family', 'breakup', 'love'],
  health: ['health', 'sick', 'tired', 'sleep', 'stress', 'anxiety', 'depressed'],
  education: ['school', 'study', 'exam', 'degree', 'university', 'course', 'learn']
};

var EMOTION_KEYWORDS = {
  frustrated: ['frustrated', 'stuck', 'annoyed', 'fed up'],
  anxious: ['anxious', 'worried', 'scared', 'nervous', 'afraid'],
  sad: ['sad', 'depressed', 'down', 'hopeless', 'lost'],
  angry: ['angry', 'mad', 'furious', 'upset'],
  hopeful: ['hopeful', 'excited', 'motivated', 'ready'],
  tired: ['tired', 'exhausted', 'drained', 'burned out']
};

function detectFromText(text, keywordMap) {
  var lower = text.toLowerCase();
  for (var key in keywordMap) {
    var words = keywordMap[key];
    for (var i = 0; i < words.length; i++) {
      if (lower.indexOf(words[i]) !== -1) return key;
    }
  }
  return null;
}

function updateMemory(userText) {
  if (!mentorMemory.topic) {
    var topic = detectFromText(userText, TOPIC_KEYWORDS);
    if (topic) mentorMemory.topic = topic;
  }
  var emotion = detectFromText(userText, EMOTION_KEYWORDS);
  if (emotion) mentorMemory.emotion = emotion;

  mentorMemory.conversationHistory.push({ role: 'user', text: userText });
}

function recordMentorReply(text) {
  mentorMemory.conversationHistory.push({ role: 'mentor', text: text });
}

/* ============================
   GEMINI API CALL
   ============================ */

async function callMentorAPI(userText) {
  try {
    var response = await fetch('/api/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        memory: mentorMemory
      })
    });

    var data = await response.json();

    if (data && data.reply) {
      return data.reply;
    } else {
      return "I'm here with you. Could you tell me a little more about that?";
    }
  } catch (err) {
    return "I'm having a moment of difficulty connecting. Could you say that again?";
  }
}

/* ============================
   CHAT UI
   ============================ */

function loadChatScreen() {
  var app = document.getElementById('app');
  app.style.overflow = 'hidden';

  mentorMemory = {
    problem: null,
    goal: null,
    rootCause: null,
    currentSituation: null,
    skills: null,
    resources: null,
    challenges: null,
    priorities: null,
    emotion: null,
    topic: null,
    conversationHistory: []
  };

  app.innerHTML =
    '<div class="chat-screen">' +
      '<div class="chat-header">' +
        '<button class="menu-btn" onclick="toggleMenu()">&#9776;</button>' +
        '<h2 class="mentor-name">MentorMe</h2>' +
        '<div class="header-right"></div>' +
      '</div>' +
      '<div class="side-menu" id="side-menu">' +
        '<div class="side-menu-header">' +
          '<img src="logo.png" class="side-logo" alt="MentorMe" />' +
          '<button class="close-menu-btn" onclick="toggleMenu()">&#10005;</button>' +
        '</div>' +
        '<div class="menu-items">' +
          '<div class="menu-item" onclick="newChat()"><span class="menu-icon">&#43;</span> New Chat</div>' +
          '<div class="menu-item" onclick="showHistory()"><span class="menu-icon">&#128172;</span> Chat History</div>' +
          '<div class="menu-item" onclick="showGoals()"><span class="menu-icon">&#127919;</span> My Goals</div>' +
          '<div class="menu-item" onclick="showProgress()"><span class="menu-icon">&#128200;</span> My Progress</div>' +
          '<div class="menu-item" onclick="showSettings()"><span class="menu-icon">&#9881;</span> Settings</div>' +
          '<div class="menu-item" onclick="showHelp()"><span class="menu-icon">&#10067;</span> Help</div>' +
        '</div>' +
        '<div class="menu-footer">' +
          '<div class="menu-item menu-logout" onclick="logout()"><span class="menu-icon">&#8594;</span> Log Out</div>' +
        '</div>' +
      '</div>' +
      '<div class="menu-overlay" id="menu-overlay" onclick="toggleMenu()"></div>' +
      '<div class="chat-messages" id="chat-messages">' +
        '<div class="message mentor-message">' +
          '<div class="message-bubble" id="intro-bubble"></div>' +
        '</div>' +
      '</div>' +
      '<div class="chat-input-area">' +
        '<div class="chat-input-wrapper">' +
          '<button class="input-left-btn" title="Attach">+</button>' +
          '<textarea id="user-input" class="chat-input" placeholder="Reply to MentorMe" rows="1" onkeydown="handleKey(event)" oninput="handleInput(this)"></textarea>' +
          '<button class="send-btn" id="send-btn" onclick="sendMessage()">' + micIconSvg() + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  setTimeout(function() {
    streamText('intro-bubble', "Hello. I'm glad you're here.\n\nI'm your personal mentor — not a chatbot, not a therapist, not a questionnaire. I listen, I ask the questions that matter, and I help you see what you might be too close to see yourself.\n\nSo let's start simple.\n\nWhat's been sitting with you lately — the thing that's hard to put down?");
  }, 600);
}

function micIconSvg() {
  return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function sendIconSvg() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function toggleMenu() {
  var menu = document.getElementById('side-menu');
  var overlay = document.getElementById('menu-overlay');
  var isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    overlay.classList.remove('active');
  } else {
    menu.classList.add('open');
    overlay.classList.add('active');
  }
}

function newChat() { toggleMenu(); loadChatScreen(); }
function showHistory() { toggleMenu(); alert('Chat history coming soon!'); }
function showGoals() { toggleMenu(); alert('Goals coming soon!'); }
function showProgress() { toggleMenu(); alert('Progress coming soon!'); }
function showSettings() { toggleMenu(); alert('Settings coming soon!'); }
function showHelp() { toggleMenu(); alert('Help coming soon!'); }
function logout() { toggleMenu(); alert('Logout coming soon!'); }

function streamText(elementId, text) {
  var el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = '';
  var i = 0;
  function next() {
    if (i < text.length) {
      el.innerHTML += text[i] === '\n' ? '<br>' : text[i];
      i++;
      scrollToBottom();
      setTimeout(next, 18);
    }
  }
  next();
}

function handleKey(e) {
  // Enter always creates a new line.
  // Sending only happens through the send button.
}

function handleInput(textarea) {
  textarea.style.height = 'auto';
  var maxHeight = 22 * 6 + 16;
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';

  var btn = document.getElementById('send-btn');
  if (!btn) return;

  if (textarea.value.trim()) {
    btn.innerHTML = sendIconSvg();
    btn.classList.add('send-active');
  } else {
    btn.innerHTML = micIconSvg();
    btn.classList.remove('send-active');
  }

  scrollToBottom();
}

function sendMessage() {
  var input = document.getElementById('user-input');
  var text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  updateMemory(text);
  input.value = '';
  input.style.height = 'auto';
  handleInput(input);

  setTimeout(function() {
    showTyping();
    callMentorAPI(text).then(function(reply) {
      hideTyping();
      recordMentorReply(reply);
      addMentorMessage(reply);
    });
  }, 300);
}

function addUserMessage(text) {
  var m = document.getElementById('chat-messages');
  var d = document.createElement('div');
  d.className = 'message user-message';
  d.innerHTML = '<div class="message-bubble">' + text + '</div>';
  m.appendChild(d);
  scrollToBottom();
}

function addMentorMessage(text) {
  var m = document.getElementById('chat-messages');
  var d = document.createElement('div');
  d.className = 'message mentor-message';
  var id = 'b' + Date.now();
  d.innerHTML = '<div class="message-bubble" id="' + id + '"></div>';
  m.appendChild(d);
  scrollToBottom();
  streamText(id, text);
}

function showTyping() {
  var m = document.getElementById('chat-messages');
  var d = document.createElement('div');
  d.className = 'message mentor-message';
  d.id = 'typing-indicator';
  d.innerHTML = '<div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div><span class="typing-label">Mentor is thinking...</span>';
  m.appendChild(d);
  scrollToBottom();
}

function hideTyping() {
  var el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function scrollToBottom() {
  var m = document.getElementById('chat-messages');
  if (m) m.scrollTop = m.scrollHeight;
}

window.visualViewport && window.visualViewport.addEventListener('resize', function() {
  scrollToBottom();
});
