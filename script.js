/**
 * AMJAD T.S // ANIME CYBER DEFENSE PORTFOLIO CORE ENGINE
 * Built with HTML5 Canvas, Web Audio API, and Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. WEB AUDIO SYNTHESIZER (ANIME FX ENGINE)
  // ==========================================
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  // Synthesized Cyber Click / Beep
  function playBeep(freq = 880, type = 'sine', duration = 0.08) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }

  // Synthesized Anime Blade Slash / "SHING!" Sound
  function playBladeSlash() {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sawtooth';
      // Fast pitch drop from 2400Hz to 300Hz
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Slash audio error:', e);
    }
  }

  // Synthesized Cyber Power-Up / Alert Sound
  function playPowerUp() {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Powerup audio error:', e);
    }
  }

  // Setup SFX Toggle
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      const textSpan = sfxToggleBtn.querySelector('.hud-text');
      const icon = sfxToggleBtn.querySelector('i');
      if (sfxEnabled) {
        textSpan.textContent = 'SFX: ON';
        icon.className = 'fa-solid fa-volume-high';
        playBladeSlash();
        triggerToast('Audio SFX: Activated');
      } else {
        textSpan.textContent = 'SFX: MUTED';
        icon.className = 'fa-solid fa-volume-xmark';
        triggerToast('Audio SFX: Muted');
      }
    });
  }

  // Generic sound triggers for .sound-click elements
  document.querySelectorAll('.sound-click').forEach(elem => {
    elem.addEventListener('mouseenter', () => playBeep(520, 'sine', 0.04));
    elem.addEventListener('click', () => {
      if (elem.classList.contains('btn-primary')) {
        playBladeSlash();
      } else {
        playBeep(980, 'triangle', 0.1);
      }
    });
  });

  // ==========================================
  // 2. MANGA POPUP ACTION WORDS & SPEEDLINES
  // ==========================================
  const mangaSoundContainer = document.getElementById('mangaSoundContainer');
  const speedlinesOverlay = document.getElementById('speedlinesOverlay');
  const mangaWords = ['ドドド', 'ズドドド', 'ゴゴゴ', 'SHING!', 'HACKED!', 'CRITICAL!', 'SLASH!', 'DEFENSE!'];

  function triggerMangaSound(x, y, word = null) {
    if (!mangaSoundContainer) return;
    const text = word || mangaWords[Math.floor(Math.random() * mangaWords.length)];
    const el = document.createElement('div');
    el.className = 'manga-sound-popup' + (/[一-龠ぁ-ゔァ-ヴー]/.test(text) ? ' jp' : '');
    el.textContent = text;
    el.style.left = (x || window.innerWidth / 2) + 'px';
    el.style.top = (y || window.innerHeight / 2) + 'px';

    mangaSoundContainer.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  function triggerSpeedlines(duration = 400) {
    if (!speedlinesOverlay) return;
    speedlinesOverlay.classList.add('active');
    setTimeout(() => {
      speedlinesOverlay.classList.remove('active');
    }, duration);
  }

  // ==========================================
  // 3. SAKURA PETALS & MATRIX PARTICLES CANVAS
  // ==========================================
  const canvas = document.getElementById('sakuraCanvas');
  let sakuraActive = true;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle classes: Sakura Petals & Cyber Dust
    class SakuraPetal {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = 9 + Math.random() * 11;
        this.speedX = -1 + Math.random() * 2;
        this.speedY = 1.2 + Math.random() * 1.8;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.03;
        this.tilt = Math.random() * Math.PI;
        this.tiltSpeed = 0.02 + Math.random() * 0.03;
        this.opacity = 0.4 + Math.random() * 0.45;
        this.isGlow = Math.random() > 0.6;
      }
      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.tilt) * 1.5 + this.speedX;
        this.angle += this.angularSpeed;
        this.tilt += this.tiltSpeed;

        if (this.y > height + 20 || this.x < -40 || this.x > width + 40) {
          this.reset();
        }
      }
      draw() {
        if (!sakuraActive) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(Math.sin(this.tilt), 1);

        ctx.beginPath();
        // Anime petal teardrop curve
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size / 2, 0, this.size);
        ctx.bezierCurveTo(this.size / 2, this.size / 2, this.size / 2, -this.size / 2, 0, 0);

        if (this.isGlow) {
          ctx.fillStyle = `rgba(255, 130, 200, ${this.opacity})`;
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(255, 180, 220, ${this.opacity})`;
          ctx.shadowColor = '#ffb3c6';
          ctx.shadowBlur = 3;
        }
        ctx.fill();
        ctx.restore();
      }
    }

    class CyberParticle {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.size = 1 + Math.random() * 2.5;
        this.speedY = -(0.5 + Math.random() * 1.5);
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = 0.2 + Math.random() * 0.6;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#9d4edd';
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
      }
    }

    const petals = Array.from({ length: 32 }, () => new SakuraPetal());
    const cyberDust = Array.from({ length: 40 }, () => new CyberParticle());

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Cyber Dust
      cyberDust.forEach(p => {
        p.update();
        p.draw();
      });

      // Update & Draw Petals
      if (sakuraActive) {
        petals.forEach(p => {
          p.update();
          p.draw();
        });
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Toggle Sakura Button
    const sakuraToggleBtn = document.getElementById('sakuraToggleBtn');
    if (sakuraToggleBtn) {
      sakuraToggleBtn.addEventListener('click', () => {
        sakuraActive = !sakuraActive;
        const textSpan = sakuraToggleBtn.querySelector('.hud-text');
        textSpan.textContent = sakuraActive ? 'SAKURA: ON' : 'SAKURA: OFF';
        sakuraToggleBtn.style.borderColor = sakuraActive ? 'var(--neon-magenta)' : 'var(--text-muted)';
        playBladeSlash();
        triggerToast(sakuraActive ? 'Sakura Petals: Enabled' : 'Sakura Petals: Disabled');
      });
    }
  }

  // ==========================================
  // 4. CUSTOM CYBER CURSOR & TRAIL
  // ==========================================
  const customCursor = document.getElementById('customCursor');
  const cursorTrail = document.getElementById('cursorTrail');

  if (customCursor && cursorTrail) {
    let mouseX = -100, mouseY = -100;
    let trailX = -100, trailY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function loopTrail() {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
      requestAnimationFrame(loopTrail);
    }
    loopTrail();

    // Hover reactions for clickable elements
    document.querySelectorAll('a, button, input, textarea, .avatar-card, .filter-pill').forEach(el => {
      el.addEventListener('mouseenter', () => customCursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => customCursor.classList.remove('hovering'));
    });
  }

  // ==========================================
  // 5. DUAL PERSONA AVATAR SYSTEM (TRANSFORM)
  // ==========================================
  const avatarCardWrapper = document.getElementById('avatarCardWrapper');
  const avatarAnimeBox = document.getElementById('avatarAnimeBox');
  const avatarRealBox = document.getElementById('avatarRealBox');
  const avatarSwitchPill = document.getElementById('avatarSwitchPill');
  const avatarModeToggleBtn = document.getElementById('avatarModeToggleBtn');

  let currentAvatarMode = 'anime'; // 'anime' or 'real'

  function toggleAvatarMode(e) {
    if (e) {
      const rect = (avatarCardWrapper || document.body).getBoundingClientRect();
      triggerMangaSound(e.clientX || rect.left + rect.width / 2, e.clientY || rect.top + rect.height / 2, 'TRANSFORM!');
    }
    triggerSpeedlines(450);
    playPowerUp();

    if (currentAvatarMode === 'anime') {
      currentAvatarMode = 'real';
      avatarAnimeBox.classList.remove('active-avatar');
      avatarRealBox.classList.add('active-avatar');
      if (avatarModeToggleBtn) {
        avatarModeToggleBtn.querySelector('.hud-text').textContent = 'MODE: OPERATIVE';
        avatarModeToggleBtn.classList.remove('glow-cyan');
      }
      triggerToast('Operative Persona: Real Photo Active');
    } else {
      currentAvatarMode = 'anime';
      avatarRealBox.classList.remove('active-avatar');
      avatarAnimeBox.classList.add('active-avatar');
      if (avatarModeToggleBtn) {
        avatarModeToggleBtn.querySelector('.hud-text').textContent = 'MODE: ANIME HERO';
        avatarModeToggleBtn.classList.add('glow-cyan');
      }
      triggerToast('Operative Persona: Anime Cyber Specialist Active');
    }
  }

  if (avatarCardWrapper) {
    avatarCardWrapper.addEventListener('click', toggleAvatarMode);
  }
  if (avatarModeToggleBtn) {
    avatarModeToggleBtn.addEventListener('click', toggleAvatarMode);
  }

  // ==========================================
  // 6. DYNAMIC GLITCH TYPING SUBTITLE
  // ==========================================
  const roles = [
    'CERTIFIED ETHICAL HACKER (CEH)',
    'CYBERSECURITY DEFENDER',
    'SIEM LOG MONITORING ARCHITECT',
    'SPLUNK & WAZUH SPECIALIST',
    'PYTHON THREAT AUTOMATOR',
    'VAPT & VULNERABILITY HUNTER'
  ];
  const typedRoleElem = document.getElementById('typedRole');
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRoleLoop() {
    if (!typedRoleElem) return;
    const current = roles[roleIdx];

    if (isDeleting) {
      typedRoleElem.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedRoleElem.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 1800; // Pause on complete word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeRoleLoop, typingSpeed);
  }
  typeRoleLoop();

  // ==========================================
  // 7. ARSENAL / SKILL MODULE FILTERING
  // ==========================================
  const filterPills = document.querySelectorAll('.filter-pill');
  const arsenalCards = document.querySelectorAll('.arsenal-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      arsenalCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'mangaSoundPop 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
      playBeep(640, 'triangle', 0.08);
    });
  });

  // ==========================================
  // 8. INTERACTIVE CLI TERMINAL ENGINE
  // ==========================================
  const terminalInput = document.getElementById('terminalInput');
  const commandHistory = document.getElementById('commandHistory');
  const shellBody = document.getElementById('shellBody');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  const cliCommands = {
    help: () => `
<div class="shell-output">
  <span class="c-yellow">AVAILABLE TERMINAL COMMANDS:</span><br>
  - <span class="c-cyan">whoami</span>      : Display Amjad's professional operative identity<br>
  - <span class="c-cyan">skills</span>      : List offensive, defensive, and SIEM competencies<br>
  - <span class="c-cyan">projects</span>    : Review Splunk & Wazuh SIEM engineering missions<br>
  - <span class="c-cyan">ceh</span>         : View official EC-Council certification record<br>
  - <span class="c-cyan">scan</span>        : Execute an anime cyber port & threat reconnaissance routine<br>
  - <span class="c-cyan">sakura</span>      : Toggle cherry blossom atmospheric particle generator<br>
  - <span class="c-cyan">contact</span>     : Retrieve direct hotline, email, and location<br>
  - <span class="c-cyan">hire</span>        : Launch recruitment authorization protocol<br>
  - <span class="c-cyan">clear</span>       : Purge console buffer<br>
</div>`,
    whoami: () => `
<div class="shell-output">
  <span class="c-green">[OPERATIVE DOSSIER]</span><br>
  NAME: Amjad T.S<br>
  DESIGNATION: Certified Ethical Hacker (CEH) // Cybersecurity Defender<br>
  LOCATION: Kodungallur, Kerala, India<br>
  BACKGROUND: B.Voc in IT (Christ College) & Adv Diploma in Cyber Defence (Red Team Hackers Academy)<br>
  SPECIALIZATION: Threat Analysis, SIEM Log Monitoring (Splunk / Wazuh), Python Automation.<br>
</div>`,
    skills: () => `
<div class="shell-output">
  <span class="c-cyan">[TACTICAL CAPABILITIES]</span><br>
  • <span class="c-purple">Offensive / Recon:</span> Burp Suite, Nmap, Metasploit, Nessus, Nikto, Hydra, Aircrack-ng, VAPT<br>
  • <span class="c-cyan">Defensive / SIEM:</span> Splunk Enterprise, Wazuh EDR, Wireshark, Threat Analysis, Risk Assessment<br>
  • <span class="c-yellow">Systems & Code:</span> Python 3 Security Scripting, Linux (Kali/Ubuntu), Windows Hardening<br>
  • <span class="c-magenta">Threat Hunting:</span> Real-time Anomaly Correlation, IoC Extraction, Incident Alerting<br>
</div>`,
    projects: () => `
<div class="shell-output">
  <span class="c-yellow">[MISSION ARCHIVES]</span><br>
  1. <span class="c-cyan">Splunk SIEM Centralized Log Monitoring</span>: Integrated Universal Forwarder to aggregate system & auth telemetry, built custom SPL brute-force alerts.<br>
  2. <span class="c-magenta">Wazuh EDR Security Infrastructure</span>: Multi-agent endpoint deployment, rootkit detection, and file integrity monitoring (FIM).<br>
  3. <span class="c-purple">Python Vulnerability Hunting Suite</span>: Multi-threaded reconnaissance and HTTP security header validator.<br>
</div>`,
    ceh: () => `
<div class="shell-output">
  <span class="c-yellow">★ CERTIFIED ETHICAL HACKER (CEH) - EC-COUNCIL ★</span><br>
  STATUS: VERIFIED & ACTIVE<br>
  DOMAINS: Threat Vectors, Trojans, Network Sniffing, Web App Security, Cloud Attacks, Cryptography.<br>
</div>`,
    contact: () => `
<div class="shell-output">
  <span class="c-green">[COMMS CHANNELS]</span><br>
  • Email: <span class="c-cyan">tsamjad07@gmail.com</span><br>
  • Phone: <span class="c-cyan">+91 8592068771</span><br>
  • Base: Kodungallur, Kerala, India<br>
  • LinkedIn: Active for direct networking<br>
</div>`,
    hire: () => `
<div class="shell-output">
  <span class="c-yellow">[RECRUITMENT PROTOCOL ENGAGED]</span><br>
  Amjad T.S is actively open to full-time cybersecurity analyst, penetration tester, and SIEM monitoring roles.<br>
  Ready to deploy immediately. Dispatch an offer to <span class="c-cyan">tsamjad07@gmail.com</span>!<br>
</div>`,
    resume: () => {
      const resSection = document.getElementById('resume');
      if (resSection) resSection.scrollIntoView({ behavior: 'smooth' });
      return `
<div class="shell-output">
  <span class="c-yellow">[RESUME DOSSIER RETRIEVED]</span><br>
  • Candidate: Amjad T.S | CEH EC-Council Certified<br>
  • Degrees: B.Voc in IT (Christ College) & Adv Diploma in Cyber Defence (Red Team Hackers)<br>
  • Notable Missions: Splunk Enterprise SIEM & Wazuh EDR Threat Telemetry<br>
  • Direct PDF: <a href="assets/amjad_resume.pdf" target="_blank" style="color:var(--neon-cyan); text-decoration:underline;">[Download/View Resume PDF]</a><br>
  <span class="c-green">&gt; Navigating to Official Resume Section...</span>
</div>`;
    },
    clear: () => {
      if (commandHistory) commandHistory.innerHTML = '';
      return '';
    },
    sakura: () => {
      sakuraActive = !sakuraActive;
      const sToggle = document.getElementById('sakuraToggleBtn');
      if (sToggle) {
        sToggle.querySelector('.hud-text').textContent = sakuraActive ? 'SAKURA: ON' : 'SAKURA: OFF';
      }
      return `<div class="shell-output"><span class="c-magenta">[SAKURA ENGINE]</span> Cherry blossom petals set to: ${sakuraActive ? 'ACTIVE' : 'STANDBY'}</div>`;
    }
  };

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo command line
    const entry = document.createElement('div');
    entry.className = 'history-item';
    entry.innerHTML = `
      <div class="prompt-line">
        <span class="prompt-user">amjad@cyber-station</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-sign">$</span>
        <span class="echo-text">${rawCmd}</span>
      </div>
    `;

    if (cmd === 'clear') {
      commandHistory.innerHTML = '';
      playBeep(440, 'triangle', 0.05);
      return;
    }

    if (cmd === 'scan') {
      runPortScanRoutine(entry);
    } else if (cliCommands[cmd]) {
      const output = cliCommands[cmd]();
      const outDiv = document.createElement('div');
      outDiv.innerHTML = output;
      entry.appendChild(outDiv);
      playBeep(880, 'sine', 0.06);
    } else {
      const errDiv = document.createElement('div');
      errDiv.className = 'shell-output';
      errDiv.innerHTML = `<span style="color:#ff5f56;">Command not recognized: '${cmd}'. Type <span class="cmd-highlight">help</span> for valid commands.</span>`;
      entry.appendChild(errDiv);
      playBeep(220, 'sawtooth', 0.1);
    }

    commandHistory.appendChild(entry);
    shellBody.scrollTop = shellBody.scrollHeight;
  }

  function runPortScanRoutine(container) {
    playBladeSlash();
    triggerSpeedlines(350);
    const scanContainer = document.createElement('div');
    scanContainer.className = 'shell-output';
    scanContainer.innerHTML = `<span class="c-yellow">&gt; [INITIATING STEALTH SYN SCAN ON 192.168.1.1/24]...</span><br>`;
    container.appendChild(scanContainer);

    const ports = [
      { p: 21, svc: 'FTP (ProFTPD 1.3.5)', state: 'VULNERABLE - Exploit available' },
      { p: 22, svc: 'SSH (OpenSSH 8.9p1)', state: 'SECURED' },
      { p: 80, svc: 'HTTP (Apache 2.4.41)', state: 'OPEN - Header inspection active' },
      { p: 443, svc: 'HTTPS (TLS 1.3)', state: 'PASS' },
      { p: 8089, svc: 'SPLUNKD (Splunk Universal Forwarder)', state: 'ACTIVE TELEMETRY STREAM' },
      { p: 1514, svc: 'WAZUH-AGENT (OSSEC Encrypted Channel)', state: 'DEFENSE MATRIX ACTIVE' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < ports.length) {
        const item = ports[i];
        const line = document.createElement('div');
        line.innerHTML = `PORT <span class="c-cyan">${item.p}/tcp</span>: <span class="c-purple">${item.svc}</span> -> <span class="${item.state.includes('VULN') ? 'c-magenta' : 'c-green'}">${item.state}</span>`;
        scanContainer.appendChild(line);
        shellBody.scrollTop = shellBody.scrollHeight;
        playBeep(500 + i * 100, 'triangle', 0.04);
        i++;
      } else {
        clearInterval(interval);
        const doneLine = document.createElement('div');
        doneLine.innerHTML = `<span class="c-green">&gt; SCAN COMPLETE: All targets ingested into Splunk & Wazuh SIEM indexers.</span>`;
        scanContainer.appendChild(doneLine);
        shellBody.scrollTop = shellBody.scrollHeight;
      }
    }, 250);
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        handleCommand(val);
        terminalInput.value = '';
      }
    });
  }

  cmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (terminalInput) terminalInput.value = cmd;
      handleCommand(cmd);
      if (terminalInput) terminalInput.value = '';
    });
  });

  // ==========================================
  // 9. PROJECT DEEP DIVE MODALS (LIVE DEMOS)
  // ==========================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const demoContent = {
    splunk: {
      tag: 'SIEM ARCHITECTURE // SPLUNK ENTERPRISE',
      title: 'Splunk Centralized Telemetry & Brute-Force Alert Engine',
      html: `
        <div style="margin-bottom: 16px;">
          <p><strong>Deployment Overview:</strong> Enterprise Splunk SIEM deployment configured to ingest auth, application, and firewall logs across distributed hosts.</p>
        </div>
        <div class="terminal-mockup" style="margin-bottom: 16px;">
          <div class="terminal-bar">
            <span class="tc red"></span><span class="tc yellow"></span><span class="tc green"></span>
            <span class="terminal-title">live_splunk_forwarder_stream.log</span>
          </div>
          <div class="terminal-screen" style="max-height: 200px; overflow-y: auto;">
            <div class="code-line"><span class="c-cyan">[07:14:02]</span> Universal Forwarder -> Ingesting /var/log/auth.log [HOST: web-srv-01]</div>
            <div class="code-line"><span class="c-yellow">[07:14:03]</span> Failed password for invalid user admin from 192.168.1.105 port 44820 ssh2</div>
            <div class="code-line"><span class="c-yellow">[07:14:04]</span> Failed password for invalid user root from 192.168.1.105 port 44822 ssh2</div>
            <div class="code-line"><span class="c-yellow">[07:14:05]</span> Failed password for invalid user oracle from 192.168.1.105 port 44824 ssh2</div>
            <div class="code-line alert-pulse"><i class="fa-solid fa-triangle-exclamation"></i> SPL ALERT: Rule 'THREAT_BRUTE_FORCE_SSH' triggered! Threshold > 3 failures in 10s.</div>
            <div class="code-line"><span class="c-green">[07:14:06]</span> Mitigation Action: IP 192.168.1.105 sent to temporary iptables isolation pool.</div>
          </div>
        </div>
        <div style="background: rgba(0,240,255,0.06); padding: 12px; border-radius: 6px; border: 1px solid var(--border-glass);">
          <strong style="color: var(--neon-cyan);">Key Takeaways:</strong>
          <ul style="margin-left: 20px; margin-top: 6px; font-size: 0.9rem;">
            <li>Deployed Splunk Universal Forwarder with minimal host resource overhead.</li>
            <li>Created scheduled saved searches and correlation searches for proactive defense.</li>
            <li>Eliminated log blind-spots and provided security operations with actionable dashboards.</li>
          </ul>
        </div>
      `
    },
    wazuh: {
      tag: 'EDR & XDR DEFENSE // WAZUH PLATFORM',
      title: 'Wazuh File Integrity & Threat Detection Architecture',
      html: `
        <div style="margin-bottom: 16px;">
          <p><strong>Deployment Overview:</strong> Distributed Wazuh Manager and agent fleet orchestrating endpoint security, rootkit scanning, and real-time File Integrity Monitoring (FIM).</p>
        </div>
        <div class="terminal-mockup" style="margin-bottom: 16px;">
          <div class="terminal-bar">
            <span class="tc red"></span><span class="tc yellow"></span><span class="tc green"></span>
            <span class="terminal-title">wazuh_alerts.json</span>
          </div>
          <div class="terminal-screen" style="max-height: 200px; overflow-y: auto;">
            <div class="code-line"><span class="c-green">[WAZUH CORE]</span> Rule ID: 550 (Level 7) - Integrity checksum altered for /etc/passwd</div>
            <div class="code-line"><span class="c-cyan">[AGENT]</span> Agent 002 (db-primary): MD5 mismatch detected</div>
            <div class="code-line"><span class="c-purple">[DETAILS]</span> Previous: b94d27b... Current: 8f9b23c... User: unknown</div>
            <div class="code-line alert-pulse cyan"><i class="fa-solid fa-shield-virus"></i> SENTINEL ACTION: Instant alert dispatch sent to SOC channel; snapshot archived.</div>
          </div>
        </div>
        <div style="background: rgba(255,0,127,0.06); padding: 12px; border-radius: 6px; border: 1px solid var(--border-magenta);">
          <strong style="color: var(--neon-magenta);">Key Takeaways:</strong>
          <ul style="margin-left: 20px; margin-top: 6px; font-size: 0.9rem;">
            <li>Zero-latency endpoint telemetry streamed directly to centralized dashboard.</li>
            <li>Hardened OS baselines against privilege escalations and unauthorized credential manipulation.</li>
            <li>Regulatory compliance mapping (PCI DSS & MITRE ATT&CK tactics).</li>
          </ul>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-project');
      const data = demoContent[pKey];
      if (data && projectModal) {
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.html;
        projectModal.classList.remove('hidden');
        playPowerUp();
      }
    });
  });

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
      playBeep(400, 'sine', 0.05);
    });
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.add('hidden');
      }
    });
  }

  // ==========================================
  // 10. QUICK COPY EMAIL & TOAST SYSTEM
  // ==========================================
  const cyberToast = document.getElementById('cyberToast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function triggerToast(msg) {
    if (!cyberToast || !toastMessage) return;
    toastMessage.textContent = msg;
    cyberToast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cyberToast.classList.add('hidden');
    }, 3200);
  }

  const copyEmailQuickBtn = document.getElementById('copyEmailQuickBtn');
  if (copyEmailQuickBtn) {
    copyEmailQuickBtn.addEventListener('click', () => {
      const email = 'tsamjad07@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playBladeSlash();
        triggerMangaSound(null, null, 'COPIED!');
        triggerToast('Email copied to clipboard: tsamjad07@gmail.com');
      }).catch(() => {
        triggerToast('tsamjad07@gmail.com');
      });
    });
  }

  // ==========================================
  // 11. DOWNLOAD RESUME BUTTON
  // ==========================================
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      playBladeSlash();
      triggerMangaSound(null, null, 'DOWNLOAD!');
      triggerToast('Downloading Amjad T.S Certified Cyber Resume PDF...');

      // Trigger download of the actual resume PDF
      const link = document.createElement('a');
      link.href = 'assets/amjad_resume.pdf';
      link.download = 'Amjad_TS_Cybersecurity_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ==========================================
  // 12. CONTACT TRANSMISSION FORM
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formSuccessToast = document.getElementById('formSuccessToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('missionSubject').value;
      const message = document.getElementById('missionMessage').value;

      playPowerUp();
      triggerSpeedlines(500);
      triggerMangaSound(null, null, 'TRANSMITTED!');

      if (formSuccessToast) {
        formSuccessToast.classList.remove('hidden');
      }

      // Generate mailto uplink
      const mailtoUrl = `mailto:tsamjad07@gmail.com?subject=${encodeURIComponent('[CYBER MISSION] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      window.location.href = mailtoUrl;

      contactForm.reset();
      triggerToast('Transmission logged! Email client opened.');
    });
  }

  // ==========================================
  // 12.5 RESUME TAB SWITCHER (DOSSIER / PDF)
  // ==========================================
  const tabDossierBtn = document.getElementById('tabDossierBtn');
  const tabPdfBtn = document.getElementById('tabPdfBtn');
  const resumeDossierView = document.getElementById('resumeDossierView');
  const resumePdfView = document.getElementById('resumePdfView');

  if (tabDossierBtn && tabPdfBtn && resumeDossierView && resumePdfView) {
    tabDossierBtn.addEventListener('click', () => {
      tabDossierBtn.classList.add('active');
      tabPdfBtn.classList.remove('active');
      resumeDossierView.classList.remove('hidden-pane');
      resumeDossierView.classList.add('active-pane');
      resumePdfView.classList.remove('active-pane');
      resumePdfView.classList.add('hidden-pane');
      playBeep(650, 'triangle', 0.05);
      triggerMangaSound(null, null, 'DOSSIER!');
    });

    tabPdfBtn.addEventListener('click', () => {
      tabPdfBtn.classList.add('active');
      tabDossierBtn.classList.remove('active');
      resumePdfView.classList.remove('hidden-pane');
      resumePdfView.classList.add('active-pane');
      resumeDossierView.classList.remove('active-pane');
      resumeDossierView.classList.add('hidden-pane');
      playPowerUp();
      triggerMangaSound(null, null, 'DOCUMENT!');
    });
  }

  // ==========================================
  // 13. MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      playBeep(700, 'triangle', 0.05);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

});
