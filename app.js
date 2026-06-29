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
