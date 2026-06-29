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
  alert('Next step coming soon!');
}

function showLogin() {
  alert('Login coming soon!');
    }
