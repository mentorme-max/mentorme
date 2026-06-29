var splashDone = false;

window.onload = function() {
  if (!splashDone) {
    splashDone = true;
    setTimeout(hideSplash, 3000);
  }
};

function hideSplash() {
  var splash = document.getElementById('splash-screen');
  var app = document.getElementById('app');
  splash.style.transition = 'opacity 0.8s ease';
  splash.style.opacity = '0';
  setTimeout(function() {
    splash.style.display = 'none';
    app.style.display = 'block';
    app.classList.remove('hidden');
    loadWelcomeScreen();
  }, 800);
}

function loadWelcomeScreen() {
  var app = document.getElementById('app');
  app.innerHTML = `
    <div class="welcome-screen">
      <img src="logo.png" class="welcome-logo" alt="MentorMe" />
      <p class="welcome-tagline">One honest conversation can change everything.</p>
      <p class="welcome-subtitle">Your personal AI mentor. Ask questions. Get honest guidance. Move forward.</p>
      <div class="welcome-features">
        <div class="feature-item"><span class="feature-icon">🎯</span><span>Finds your real problem</span></div>
        <div class="feature-item"><span class="feature-icon">💡</span><span>Gives practical advice</span></div>
        <div class="feature-item"><span class="feature-icon">🧠</span><span>Remembers your journey</span></div>
        <div class="feature-item"><span class="feature-icon">🌍</span><span>Available anywhere, anytime</span></div>
      </div>
      <button class="btn-primary" onclick="startJourney()">Start Free Session</button>
      <p class="welcome-login">Already have an account? <span class="link" onclick="showLogin()">Sign in</span></p>
    </div>
  `;
}

function startJourney() {
  loadChatScreen();
}

function showLogin() {
  alert('Login coming soon!');
}

function loadChatScreen() {
  var app = document.getElementById('app');

  app.innerHTML = `
    <div class="chat-screen">

      <!-- HEADER -->
      <div class="chat-header">
        <div class="chat-header-left">
          <div class="mentor-avatar">M</div>
          <div class="mentor-info">
            <h2 class="mentor-name">MentorMe</h2>
            <p class="mentor-status">● Online — ready to help</p>
          </div>
        </div>
        <div class="chat-header-right">
          <button class="mode-btn" onclick="showModes()">🎯 Mode</button>
        </div>
      </div>

      <!-- MESSAGES -->
      <div class="chat-messages" id="chat-messages">
        <div class="message mentor-message" id="intro-message">
          <div class="message-bubble" id="intro-bubble"></div>
        </div>
      </div>

      <!-- INPUT -->
      <div class="chat-input-area">
        <div class="chat-input-wrapper">
          <textarea 
            id="user-input" 
            class="chat-input" 
            placeholder="Type your message..."
            rows="1"
            onkeydown="handleKey(event)"
            oninput="autoResize(this)"
          ></
>
        </div>
      </div>

    </div>
  `;

  setTimeout(function() {
    streamText(
      'intro-bubble',
      "Hello. I'm glad you're here.\n\nI'm your personal mentor — not a chatbot, not an assistant. I ask questions, I listen, and I help you figure things out.\n\nBefore we begin, let me ask you something simple.\n\nWhat's been on your mind lately?"
    );
  }, 500);
}

function streamText(elementId, text) {
  var element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = '';
  var index = 0;
  var speed = 18;
  function typeNext() {
    if (index < text.length) {
      if (text[index] === '\n') {
        element.innerHTML += '<br>';
      } else {
        element.innerHTML += text[index];
      }
      index++;
      setTimeout(typeNext, speed);
    }
  }
  typeNext();
}

function handleKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function sendMessage() {
  var input = document.getElementById('user-input');
  var text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';
  input.style.height = 'auto';
  setTimeout(function() {
    showTyping();
    setTimeout(function() {
      hideTyping();
      addMentorMessage("I hear you. That takes courage to say.\n\nTell me more — when did this start feeling this way for you?");
    }, 2000);
  }, 300);
}

function addMessage(text, sender) {
  var messages = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'message ' + sender + '-message';
  div.innerHTML = '<div class="message-bubble">' + text + '</div>';
  messages.appendChild(div);
  scrollToBottom();
}

function addMentorMessage(text) {
  var messages = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'message mentor-message';
  var bubbleId = 'bubble-' + Date.now();
  div.innerHTML = '<div class="message-bubble" id="' + bubbleId + '"></div>';
  messages.appendChild(div);
  scrollToBottom();
  streamText(bubbleId, text);
}

function showTyping() {
  var messages = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'message mentor-message';
  div.id = 'typing-indicator';
  div.innerHTML = '<div class="typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  messages.appendChild(div);
  scrollToBottom();
}

function hideTyping() {
  var typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function scrollToBottom() {
  var messages = document.getElementById('chat-messages');
  messages.scrollTop = messages.scrollHeight;
}

function showModes() {
  alert('Mentor modes coming soon!');
             }
