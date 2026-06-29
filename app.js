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

function loadChatScreen() {
  var app = document.getElementById('app');
  app.style.overflow = 'hidden';
  app.innerHTML = '<div class="chat-screen"><div class="chat-header"><div class="chat-header-left"><img src="logo.png" class="mentor-avatar-img" alt="MentorMe" /><div><h2 class="mentor-name">MentorMe</h2><p class="mentor-status">&#9679; Online</p></div></div><button class="mode-btn" onclick="alert(\'Modes coming soon!\')">🎯 Mode</button></div><div class="chat-messages" id="chat-messages"><div class="message mentor-message"><div class="message-bubble" id="intro-bubble"></div></div></div><div class="chat-input-area"><div class="chat-input-wrapper"><button class="input-left-btn">+</button><textarea id="user-input" class="chat-input" placeholder="Reply to MentorMe" rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea><button class="mic-btn">🎤</button><button class="send-btn" onclick="sendMessage()">&#9650;</button></div></div></div>';
  setTimeout(function() {
    streamText('intro-bubble', "Hello. I'm glad you're here.\n\nI'm your personal mentor — not a chatbot, not an assistant. I ask questions, I listen, and I help you figure things out.\n\nBefore we begin, let me ask you something simple.\n\nWhat's been on your mind lately?");
  }, 600);
}

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
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function autoResize(t) {
  t.style.height = 'auto';
  t.style.height = Math.min(t.scrollHeight, 130) + 'px';
}

function sendMessage() {
  var input = document.getElementById('user-input');
  var text = input.value.trim();
  if (!text) return;
  addUserMessage(text);
  input.value = '';
  input.style.height = 'auto';
  setTimeout(function() {
    showTyping();
    setTimeout(function() {
      hideTyping();
      addMentorMessage("I hear you. That takes courage to say.\n\nTell me more — when did this start feeling this way for you?");
    }, 2200);
  }, 400);
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
  d.innerHTML = '<div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
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
