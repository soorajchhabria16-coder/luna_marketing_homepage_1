/* ===================== ANIMATED STAR CANVAS ===================== */
(function () {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const STAR_COUNT = 280;
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x:     Math.random(),          // fractional so resize works
            y:     Math.random(),
            r:     Math.random() * 1.6 + 0.3,
            alpha: Math.random(),
            delta: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
            color: Math.random() < 0.15 ? '#f8cf9c' : '#ffffff'  // 15% gold, rest white
        });
    }

    // Occasional shooting star
    let shootingStar = null;
    function spawnShootingStar() {
        shootingStar = {
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height * 0.4,
            len:   Math.random() * 120 + 60,
            speed: Math.random() * 8 + 6,
            alpha: 1
        };
        setTimeout(spawnShootingStar, Math.random() * 8000 + 5000);
    }
    setTimeout(spawnShootingStar, 3000);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a very subtle dark gradient background on canvas
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, 'rgba(8,9,20,0.92)');
        grad.addColorStop(1, 'rgba(13,15,27,0.98)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        stars.forEach(s => {
            s.alpha += s.delta;
            if (s.alpha <= 0.05 || s.alpha >= 1) s.delta *= -1;

            ctx.beginPath();
            ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color === '#f8cf9c'
                ? `rgba(248,207,156,${s.alpha})`
                : `rgba(255,255,255,${s.alpha})`;
            ctx.fill();
        });

        // Draw shooting star
        if (shootingStar) {
            const ss = shootingStar;
            const grd = ctx.createLinearGradient(ss.x, ss.y, ss.x + ss.len, ss.y + ss.len * 0.5);
            grd.addColorStop(0, `rgba(255,255,255,0)`);
            grd.addColorStop(1, `rgba(255,255,255,${ss.alpha})`);
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x + ss.len, ss.y + ss.len * 0.5);
            ctx.strokeStyle = grd;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ss.x += ss.speed;
            ss.y += ss.speed * 0.5;
            ss.alpha -= 0.02;
            if (ss.alpha <= 0) shootingStar = null;
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

document.addEventListener('DOMContentLoaded', () => {
    // Reveal elements on scroll
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger once on load in case elements are already in view
    revealOnScroll();

    // Micro-interaction: Scroll Parallax for Hero Elements
    const parallaxElements = document.querySelectorAll('.hero-visual img, .about-orb');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = 0.15;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only apply to anchors with a hash
            if (this.getAttribute('href').startsWith('#') && this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                    
                    // Update active class
                    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Tab switching logic for educational pages
    const eduTabs = document.querySelectorAll('.edu-tab');
    const eduPanes = document.querySelectorAll('.edu-pane');

    if (eduTabs.length > 0) {
        eduTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs and panes
                eduTabs.forEach(t => t.classList.remove('active'));
                eduPanes.forEach(p => p.classList.remove('active'));

                // Add active to clicked tab
                tab.classList.add('active');

                // Add active to corresponding pane
                const targetId = tab.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // Micro-interaction: 3D Tilt & Glow Effect on Glass Cards
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Calculate tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3; // Subtle 3deg max tilt
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Birth Chart Generator Logic
    const birthChartForm = document.getElementById('birth-chart-form');
    const chartResults = document.getElementById('chart-results');
    
    if(birthChartForm && chartResults) {
        birthChartForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const location = document.getElementById('location').value;
            const time = document.getElementById('time').value;
            
            document.getElementById('display-name').textContent = name || 'Your';
            document.getElementById('display-location').textContent = location || 'Unknown Location';
            
            if(time) {
                let [h, m] = time.split(':');
                let ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12 || 12;
                document.getElementById('display-time').textContent = `${h}:${m} ${ampm}`;
            }
            
            birthChartForm.closest('.form-card').style.opacity = '0.5';
            birthChartForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
            
            chartResults.style.display = 'block';
            
            setTimeout(() => {
                chartResults.classList.add('active');
                window.scrollTo({
                    top: chartResults.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 100);
        });
    }

    // Today's Date Dynamic Update
    const dateEl = document.getElementById('today-date');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Horoscope Logic
    const signBtns = document.querySelectorAll('.sign-btn');
    if (signBtns.length > 0) {
        const horoscopes = {
            aries:       { symbol:'♈', name:'Aries',       dates:'Mar 21 – Apr 19', love:85, work:90, health:70, text:"Mars, your ruling planet, is forming a trine with Jupiter today — a powerful alignment that energises your ambitions and opens doors for bold action. Pitch ideas, take initiative, and say yes to aligned opportunities.", lucky:"Crimson", crystal:"Red Jasper", numbers:"7, 14, 21" },
            taurus:      { symbol:'♉', name:'Taurus',      dates:'Apr 20 – May 20', love:80, work:65, health:90, text:"Venus wraps you in warmth today. Domestic pleasures, sensory experiences, and quality time with loved ones will restore your soul. A good day to invest in what makes you feel secure and beautiful.", lucky:"Emerald Green", crystal:"Rose Quartz", numbers:"2, 6, 12" },
            gemini:      { symbol:'♊', name:'Gemini',      dates:'May 21 – Jun 20', love:70, work:85, health:75, text:"Mercury in Pisces blurs your normally sharp wit, but unlocks imaginative thinking. A brilliant day for creative writing, brainstorming, or following an unconventional idea that keeps nudging at you.", lucky:"Yellow", crystal:"Citrine", numbers:"5, 11, 23" },
            cancer:      { symbol:'♋', name:'Cancer',      dates:'Jun 21 – Jul 22', love:90, work:70, health:80, text:"The moon in Scorpio, a fellow water sign, electrifies your emotional life. Deep conversations, meaningful bonds, and powerful healing are all favoured. Trust your instincts — they are sharper than usual.", lucky:"Silver White", crystal:"Moonstone", numbers:"2, 7, 14" },
            leo:         { symbol:'♌', name:'Leo',         dates:'Jul 23 – Aug 22', love:75, work:80, health:85, text:"Jupiter's expansive influence calls you to dream bigger. Your natural leadership shines through, and others are drawn to your confidence. Take centre stage today — you've earned it.", lucky:"Gold", crystal:"Tiger's Eye", numbers:"1, 10, 28" },
            virgo:       { symbol:'♍', name:'Virgo',       dates:'Aug 23 – Sep 22', love:65, work:95, health:80, text:"Saturn rewards your diligence with a breakthrough at work. A detail you noticed that others missed turns out to be crucial. Your analytical gifts are your superpower today.", lucky:"Navy Blue", crystal:"Amazonite", numbers:"6, 15, 24" },
            libra:       { symbol:'♎', name:'Libra',       dates:'Sep 23 – Oct 22', love:90, work:75, health:70, text:"Venus trine Jupiter is absolutely sparkling in your chart. Love connections deepen, social encounters are charmed, and your aesthetic sense is at its peak. Collaborate, connect, and celebrate.",  lucky:"Blush Pink", crystal:"Opal", numbers:"6, 9, 15" },
            scorpio:     { symbol:'♏', name:'Scorpio',     dates:'Oct 23 – Nov 21', love:80, work:85, health:90, text:"The moon is in your sign, magnifying your emotional intelligence and magnetic power. You see through surfaces effortlessly. Use this clarity to resolve something that has lingered unaddressed.", lucky:"Deep Red", crystal:"Obsidian", numbers:"8, 13, 22" },
            sagittarius: { symbol:'♐', name:'Sagittarius', dates:'Nov 22 – Dec 21', love:70, work:80, health:85, text:"Jupiter, your ruling planet, invites you to expand your philosophical horizons. A conversation with someone from a very different background today could shift your entire perspective — stay open.", lucky:"Purple", crystal:"Turquoise", numbers:"3, 9, 21" },
            capricorn:   { symbol:'♑', name:'Capricorn',   dates:'Dec 22 – Jan 19', love:75, work:90, health:70, text:"Saturn's influence steadies your hands and sharpens your long-term strategy. A complex project that felt overwhelming suddenly clicks into place. Slow, methodical progress is your power today.", lucky:"Charcoal", crystal:"Garnet", numbers:"4, 8, 16" },
            aquarius:    { symbol:'♒', name:'Aquarius',    dates:'Jan 20 – Feb 18', love:80, work:75, health:80, text:"Uranus stirs your innovative thinking and draws unexpected, exciting people into your orbit. A flash of insight about a community project or collective goal could be the seed of something remarkable.", lucky:"Electric Blue", crystal:"Labradorite", numbers:"4, 11, 22" },
            pisces:      { symbol:'♓', name:'Pisces',      dates:'Feb 19 – Mar 20', love:85, work:70, health:75, text:"The sun illuminates your sign, charging every cell of your being with creative, spiritual energy. Your empathy is your greatest gift — today it might literally change someone's life. Trust your dreams.", lucky:"Sea Green", crystal:"Aquamarine", numbers:"7, 12, 29" }
        };

        signBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                signBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const data = horoscopes[btn.dataset.sign];
                document.getElementById('horo-symbol').textContent = data.symbol;
                document.getElementById('horo-sign-name').textContent = data.name;
                document.getElementById('horo-dates').textContent = data.dates;
                document.getElementById('horo-text').textContent = data.text;
                
                document.getElementById('energy-love').style.width = data.love + '%';
                document.getElementById('energy-work').style.width = data.work + '%';
                document.getElementById('energy-health').style.width = data.health + '%';
                
                const tags = document.querySelectorAll('.horo-tag');
                tags[0].innerHTML = `<i class="fa-solid fa-wand-sparkles"></i> Lucky Colour: ${data.lucky}`;
                tags[1].innerHTML = `<i class="fa-solid fa-gem"></i> Crystal: ${data.crystal}`;
                tags[2].innerHTML = `<i class="fa-solid fa-hashtag"></i> ${data.numbers}`;
            });
        });
    }
});
