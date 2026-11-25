(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

  // Typing effect
  const phrases = ['secure cloud infrastructure.', 'resilient networks.', 'automation with AI.', 'CTF solutions.'];
  const typed = $('#typed'); let p = 0, c = 0, del = false;
  (function type() {
    if (reduce) { typed.textContent = phrases[0]; return; }
    typed.textContent = phrases[p].slice(0, c);
    if (!del && c === phrases[p].length) { del = true; return setTimeout(type, 1500); }
    if (del && c === 0) { del = false; p = (p + 1) % phrases.length; }
    c += del ? -1 : 1; setTimeout(type, del ? 30 : 65);
  })();

  // Counters
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count; if (reduce) return (el.textContent = to);
    let n = 0; (function step() { n = Math.min(to, n + Math.ceil(to / 40)); el.textContent = n; if (n < to) setTimeout(step, 30); })();
  });

  // Reveal, progress, active link
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: .1 });
  $$('.reveal').forEach(el => io.observe(el));
  const links = $$('nav a:not(.nav-cta)'), secs = links.map(a => $(a.hash));
  addEventListener('scroll', () => {
    const h = document.documentElement;
    $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  }, { passive: true });

  // Mobile menu
  const nav = $('#nav'), mb = $('.menu-btn');
  mb.onclick = () => mb.setAttribute('aria-expanded', nav.classList.toggle('open'));
  nav.onclick = e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); mb.setAttribute('aria-expanded', false); } };

  // Project filter
  $$('.chip-btn').forEach(b => b.onclick = () => {
    $$('.chip-btn').forEach(x => x.classList.toggle('active', x === b));
    $$('#projects .card').forEach(card => card.classList.toggle('hide', b.dataset.f !== 'all' && !card.dataset.c.split(' ').includes(b.dataset.f)));
  });

  // Live GitHub repos (public API; hides the section if nothing to show)
  const box = $('#repos');
  fetch('https://api.github.com/users/Abdullah-in-cyber/repos?sort=updated&per_page=6')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const repos = list.filter(r => !r.fork && !r.name.toLowerCase().endsWith('.github.io'));
      if (!repos.length) return $('#repos').closest('section').remove();
      box.textContent = '';
      repos.forEach(r => {
        const a = document.createElement('article'); a.className = 'card';
        const bd = document.createElement('span'); bd.className = 'badge'; bd.textContent = r.language || 'Repository';
        const h = document.createElement('h3'); h.textContent = r.name;
        const d = document.createElement('p'); d.textContent = r.description || 'No description yet.';
        const l = document.createElement('a'); l.className = 'more'; l.href = r.html_url; l.textContent = 'View on GitHub →';
        a.append(bd, h, d, l); box.appendChild(a);
      });
    })
    .catch(() => $('#repos').closest('section').remove());

  // Terminal
  const out = $('#out'), form = $('#form'), inp = $('#cmd');
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
    if (k === 'clear') out.textContent = ''; else print(cmds[k] || `command not found: ${v}. Type "help".`);
  };
  inp.onkeydown = e => {
    if (e.key === 'ArrowUp' && hi > 0) { inp.value = hist[--hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { inp.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ''); e.preventDefault(); }
  };
  $('#term').onclick = () => inp.focus({ preventScroll: true });
})();
