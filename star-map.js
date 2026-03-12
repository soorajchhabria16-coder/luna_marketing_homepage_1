document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starMapCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    let width, height, centerX, centerY;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        centerX = width / 2;
        centerY = height / 2;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Star Map settings
    const numStars = window.innerWidth > 900 ? 700 : 350; // Less stars on mobile for performance
    const stars = [];
    let rotationAngle = 0;
    let isRotating = true;
    let drawConstellations = true;
    let rotationSpeed = 0.0003;
    
    // Mouse tracking for interaction
    const mouse = { x: -1000, y: -1000, radius: 200 };
    
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    canvas.addEventListener('mouseleave', () => {
        // Move mouse offscreen smoothly
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        if(e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });
    canvas.addEventListener('touchend', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Controls
    const btnRotate = document.getElementById('btn-rotate');
    const btnLines = document.getElementById('btn-lines');
    const btnSpeed = document.getElementById('btn-speed');

    btnRotate.addEventListener('click', () => {
        isRotating = !isRotating;
        btnRotate.innerHTML = isRotating ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Play';
        if(isRotating) btnRotate.classList.remove('active');
        else btnRotate.classList.add('active');
    });

    btnLines.addEventListener('click', () => {
        drawConstellations = !drawConstellations;
        if(drawConstellations) {
            btnLines.classList.add('active');
            btnLines.innerHTML = '<i class="fa-solid fa-project-diagram"></i> Constellations';
        } else {
            btnLines.classList.remove('active');
            btnLines.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hidden';
        }
    });

    let speedMode = 1; // 1: normal, 2: fast, 3: warp
    btnSpeed.addEventListener('click', () => {
        speedMode = (speedMode % 3) + 1;
        if (speedMode === 1) {
            rotationSpeed = 0.0003;
            btnSpeed.classList.remove('active');
            btnSpeed.innerHTML = '<i class="fa-solid fa-forward"></i> Speed';
        } else if (speedMode === 2) {
            rotationSpeed = 0.0015;
            btnSpeed.classList.add('active');
            btnSpeed.innerHTML = '<i class="fa-solid fa-forward-fast"></i> Fast';
            btnSpeed.style.color = "var(--gold-accent)";
        } else {
            rotationSpeed = 0.006;
            btnSpeed.classList.add('active');
            btnSpeed.innerHTML = '<i class="fa-solid fa-shuttle-space"></i> Warp';
            btnSpeed.style.color = "#ff8a80"; // Red tint for warp
        }
    });

    // Create stars
    for (let i = 0; i < numStars; i++) {
        // Distribute stars outwards, denser in the middle
        const radius = Math.random() * Math.random() * Math.max(width, height) * 1.2;
        const angle = Math.random() * Math.PI * 2;
        
        // Size variation
        let size = Math.random() * 1.5 + 0.5;
        if(Math.random() > 0.95) size += 1.5; // Occasional large star
        
        // Color variation
        let colorType = Math.random();
        let color;
        if (colorType < 0.6) color = 'rgba(255, 255, 255, '; // White
        else if (colorType < 0.85) color = 'rgba(248, 207, 156, '; // Gold
        else color = 'rgba(179, 157, 219, ' ; // Purple/Blue
            
        stars.push({
            radius: radius,
            angle: angle,
            size: size,
            baseAlpha: Math.random() * 0.5 + 0.2,
            colorPrefix: color,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2,
            x: 0,
            y: 0
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (isRotating) {
            rotationAngle += rotationSpeed;
        }

        // Cache visible stars to compute connections efficiently
        const visibleStars = [];

        // Draw stars
        stars.forEach(star => {
            // Update twinkle
            star.twinklePhase += star.twinkleSpeed;
            const currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.4;
            const clampedAlpha = Math.max(0.05, Math.min(1, currentAlpha));

            // Calculate position with rotation
            const currentAngle = star.angle + rotationAngle;
            
            // Apply elliptical orbit for 3D perspective effect
            star.x = centerX + Math.cos(currentAngle) * star.radius;
            star.y = centerY + Math.sin(currentAngle) * star.radius * 0.7; // Y scaled for tilt

            // Screen boundary check (slight padding so lines don't clip harshly)
            if (star.x > -50 && star.x < width + 50 && star.y > -50 && star.y < height + 50) {
                visibleStars.push(star);
                
                // Draw soft glow
                if(star.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = star.colorPrefix + (clampedAlpha * 0.2) + ')';
                    ctx.fill();
                }

                // Draw bright core
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.colorPrefix + clampedAlpha + ')';
                ctx.fill();
            }
        });

        // Draw Constellation Lines
        if (drawConstellations) {
            ctx.lineWidth = 0.6;
            
            for (let i = 0; i < visibleStars.length; i++) {
                const starA = visibleStars[i];
                
                // 1. Interactive Web Effect (connect to mouse)
                const distToMouse = Math.hypot(starA.x - mouse.x, starA.y - mouse.y);
                if (distToMouse < mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(starA.x, starA.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    // Fade out based on distance
                    const opacity = (1 - (distToMouse / mouse.radius)) * 0.5;
                    ctx.strokeStyle = `rgba(248, 207, 156, ${opacity})`;
                    ctx.stroke();
                    
                    // Slightly attract star to mouse (parallax effect)
                    starA.x += (mouse.x - starA.x) * 0.02;
                    starA.y += (mouse.y - starA.y) * 0.02;
                }

                // 2. Static Constellations (connect close stars)
                // Limit connections per star to avoid clutter
                let connections = 0;
                for (let j = i + 1; j < visibleStars.length; j++) {
                    if(connections > 3) break;
                    
                    const starB = visibleStars[j];
                    const dist = Math.hypot(starA.x - starB.x, starA.y - starB.y);
                    
                    // Connection distance threshold
                    const threshold = 65;
                    
                    if (dist < threshold) {
                        ctx.beginPath();
                        ctx.moveTo(starA.x, starA.y);
                        ctx.lineTo(starB.x, starB.y);
                        
                        const opacity = (1 - (dist / threshold)) * 0.15;
                        ctx.strokeStyle = `rgba(200, 220, 255, ${opacity})`;
                        ctx.stroke();
                        connections++;
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
});
