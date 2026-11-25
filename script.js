(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Matrix-style background
  const cv = document.getElementById('bg'), cx = cv.getContext('2d');
  let cols, drops;
  const chars = '01<>/{}[]#$%ABCDEF'.split('');
  function size() {
    cv.width = innerWidth; cv.height = innerHeight;
    cols = Math.floor(cv.width / 18); drops = Array.from({ length: cols }, () => Math.random() * cv.height / 18);
  }
  size(); addEventListener('resize', size);
  function rain() {
    cx.fillStyle = 'rgba(6,9,20,.12)'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.font = '14px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      cx.fillStyle = Math.random() > .96 ? '#2dd9e4' : 'rgba(0,229,160,.35)';
      cx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 18, y * 18);
      drops[i] = y * 18 > cv.height && Math.random() > .975 ? 0 : y + 1;
    });
  }
  if (!reduce) setInterval(rain, 70); else { cx.fillStyle = '#060914'; cx.fillRect(0, 0, cv.width, cv.height); }

  // Typing effect
  const phrases = ['Cloud security', 'Infrastructure & networking', 'AI automation', 'Capture the flag'];
  const typed = document.getElementById('typed'); let p = 0, c = 0, del = false;
  (function type() {
    if (reduce) { typed.textContent = phrases.join(' | '); return; }
    typed.textContent = phrases[p].slice(0, c);
    if (!del && c === phrases[p].length) { del = true; return setTimeout(type, 1400); }
    if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
    c += del ? -1 : 1; setTimeout(type, del ? 35 : 75);
  })();

  // Counters
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const to = +el.dataset.count; if (reduce) return (el.textContent = to);
    let n = 0; const step = () => { n += Math.ceil(to / 40); if (n >= to) n = to; el.textContent = n; if (n < to) setTimeout(step, 30); };
    step();
  });

  // Scroll reveal, progress bar, active nav
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const links = [...document.querySelectorAll('nav a')], secs = links.map(a => document.querySelector(a.hash));
  addEventListener('scroll', () => {
    const h = document.documentElement;
    document.getElementById('progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  }, { passive: true });

  // Mobile menu
  const nav = document.getElementById('nav'), mb = document.querySelector('.menu-btn');
  mb.onclick = () => mb.setAttribute('aria-expanded', nav.classList.toggle('open'));
  nav.onclick = e => e.target.tagName === 'A' && (nav.classList.remove('open'), mb.setAttribute('aria-expanded', false));

  // Skill filter
  document.querySelectorAll('.chip-btn').forEach(b => b.onclick = () => {
    document.querySelectorAll('.chip-btn').forEach(x => x.classList.toggle('active', x === b));
    document.querySelectorAll('.skill').forEach(s => s.classList.toggle('dim', b.dataset.f !== 'all' && s.dataset.c !== b.dataset.f));
  });

  // Terminal
  const out = document.getElementById('out'), form = document.getElementById('form'), inp = document.getElementById('cmd');
  const cmds = {
    help: 'Commands: help, whoami, skills, certs, ctf, projects, contact, clear',
    whoami: 'Muhammad Abdullah\nBE Information Security, NUST (Semester 3)\nInterests: infrastructure, networking, cloud, AI automation',
    skills: 'Cloud security (AWS) | Networking | IAM | Incident response\nDigital forensics | Kubernetes | Linux | Python | Git | AI automation',
    certs: '[x] AWS Certified Cloud Practitioner\n[x] CCEP (Red Team Leaders)\n[x] Cisco Networking Basics\n[x] Cisco Introduction to Cybersecurity',
    ctf: 'Hi Cyber Con CTF 2026 | team: The Arachnid Sentries\nSolved 49/69 challenges | 162nd globally of ~1,100 teams | 1st in Pakistan',
    projects: '1. Cloud Security Misconfiguration Checker\n2. WordPress CMS Deployment\n3. Autopsy USB Investigation\n4. Enterprise Identity Governance\n5. Hi Cyber Con CTF 2026',
    contact: 'GitHub:   github.com/Abdullah-in-cyber\nLinkedIn: linkedin.com/in/muhammad-abdullah-102615388\nEmail:    abdullahatwork7@gmail.com'
  };
  const hist = []; let hi = 0;
  const print = (t, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = t; out.appendChild(d); out.scrollTop = out.scrollHeight; };
  print('Welcome. Type "help" to list commands.');
  form.onsubmit = e => {
    e.preventDefault(); const v = inp.value.trim(); inp.value = ''; if (!v) return;
    hist.push(v); hi = hist.length; print('$ ' + v, 'cmd');
    const k = v.toLowerCase();
    if (k === 'clear') out.textContent = '';
    else print(cmds[k] || `command not found: ${v}. Type "help".`);
  };
  inp.onkeydown = e => {
    if (e.key === 'ArrowUp' && hi > 0) { inp.value = hist[--hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { inp.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ''); e.preventDefault(); }
  };
  document.getElementById('term').onclick = () => inp.focus({ preventScroll: true });
})();
