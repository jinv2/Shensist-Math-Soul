/**
 * main.js - The Physical & Spiritual Core
 */

(function() {
    "use strict";

    // --- 0. Spirit Scroll & Resonance ---
    const scrollContent = document.getElementById('scroll-content');
    const resSvg = document.getElementById('resonance-svg');
    const pathL = document.getElementById('resonance-path-left');
    const pathR = document.getElementById('resonance-path-right');

    function logDiscovery(n1, n2, op, result) {
        if (!scrollContent) return;
        const entry = document.createElement('div');
        entry.className = 'scroll-entry';
        const dateStr = new Date().toLocaleTimeString('zh-CN', {hour12: false});
        entry.innerHTML = `
            <div class="text-[10px] opacity-40 mb-1">${dateStr} · 灵机显现</div>
            <div class="text-lg">【${n1}】 ${op} 【${n2}】 ➔ <span class="text-amber-600">${result}</span></div>
        `;
        scrollContent.prepend(entry);
        if (scrollContent.children.length > 30) scrollContent.removeChild(scrollContent.lastChild);
        
        // Pulse resonance threads
        [pathL, pathR].forEach(p => {
            if (p) {
                p.style.opacity = '0.8';
                p.style.strokeWidth = '4';
                setTimeout(() => {
                    p.style.opacity = '0.3';
                    p.style.strokeWidth = '2';
                }, 500);
            }
        });
    }

    function updateResonancePaths() {
        if (!pathL || !pathR) return;
        
        const leftBox = document.getElementById('leftWheel').getBoundingClientRect();
        const rightBox = document.getElementById('rightWheel').getBoundingClientRect();
        const opBox = document.getElementById('op-hub').getBoundingClientRect();
        
        const startLX = leftBox.left + leftBox.width;
        const startLY = leftBox.top + leftBox.height / 2;
        const endLX = opBox.left;
        const endLY = opBox.top + opBox.height / 2;

        const startRX = rightBox.left;
        const startRY = rightBox.top + rightBox.height / 2;
        const endRX = opBox.left + opBox.width;
        const endRY = opBox.top + opBox.height / 2;

        pathL.setAttribute('d', `M ${startLX} ${startLY} Q ${(startLX+endLX)/2} ${startLY+20} ${endLX} ${endLY}`);
        pathR.setAttribute('d', `M ${startRX} ${startRY} Q ${(startRX+endRX)/2} ${startRY-20} ${endRX} ${endRY}`);
    }
    window.addEventListener('resize', updateResonancePaths);

    // --- 1. Audio Engine ---
    const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let currentOpAudio = null;
    function playGearRotation() {
        if (AudioCtx.state === 'suspended') AudioCtx.resume();
        const now = AudioCtx.currentTime;
        
        // --- 1. Rolling Friction (Mechanical Sliding) ---
        const rollLen = 0.2;
        const rollBuffer = AudioCtx.createBuffer(1, AudioCtx.sampleRate * rollLen, AudioCtx.sampleRate);
        const rollData = rollBuffer.getChannelData(0);
        for (let i = 0; i < rollBuffer.length; i++) rollData[i] = Math.random() * 2 - 1;
        
        const rollSource = AudioCtx.createBufferSource();
        rollSource.buffer = rollBuffer;
        const rollGain = AudioCtx.createGain();
        const rollFilter = AudioCtx.createBiquadFilter();
        
        rollFilter.type = 'bandpass';
        rollFilter.frequency.setValueAtTime(400, now);
        rollFilter.frequency.exponentialRampToValueAtTime(1200, now + rollLen);
        rollFilter.Q.value = 1;
        
        rollGain.gain.setValueAtTime(0, now);
        rollGain.gain.linearRampToValueAtTime(0.04, now + 0.05);
        rollGain.gain.exponentialRampToValueAtTime(0.001, now + rollLen);
        
        rollSource.connect(rollFilter);
        rollFilter.connect(rollGain);
        rollGain.connect(AudioCtx.destination);
        rollSource.start(now);
        rollSource.stop(now + rollLen);

        // --- 2. Heavy Engagement Click (The Snap) ---
        const clickTime = now + 0.05; // Slightly delayed click
        const osc = AudioCtx.createOscillator();
        const gLow = AudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, clickTime);
        osc.frequency.exponentialRampToValueAtTime(40, clickTime + 0.1);
        gLow.gain.setValueAtTime(0.12, clickTime);
        gLow.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.1);
        osc.connect(gLow);
        gLow.connect(AudioCtx.destination);
        osc.start(clickTime);
        osc.stop(clickTime + 0.1);

        const clickNoise = AudioCtx.createBufferSource();
        clickNoise.buffer = rollBuffer; // Reuse buffer
        const gHigh = AudioCtx.createGain();
        gHigh.gain.setValueAtTime(0.06, clickTime);
        gHigh.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.04);
        const filter = AudioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, clickTime);
        clickNoise.connect(filter);
        filter.connect(gHigh);
        gHigh.connect(AudioCtx.destination);
        clickNoise.start(clickTime);
        clickNoise.stop(clickTime + 0.04);
    }
    const operatorAudio = { '+': new Audio('assets/加法.wav'), '-': new Audio('assets/减法.wav'), '×': new Audio('assets/乘法.wav'), '÷': new Audio('assets/除法.wav') };
    function playOpSound(op) { if (currentOpAudio) { currentOpAudio.pause(); currentOpAudio.currentTime = 0; } const audio = operatorAudio[op]; if (audio) { currentOpAudio = audio; audio.currentTime = 0; audio.play().catch(e => console.warn("Audio play failed:", e)); } }

    // --- 2. Spirit Beast Rendering ---
    const BEAST_DATA = { 
        '+': { icon: '🐉', name: '九天龙腾 · 加法' }, 
        '-': { icon: '🐢', name: '玄武守正 · 减法' }, 
        '×': { icon: '🔥', name: '凤凰焚空 · 乘法' }, 
        '÷': { icon: '🦄', name: '麒麟御世 · 除法' } 
    };
    function renderBeasts(n, containerId) {
        const container = document.getElementById(containerId); if (!container) return;
        container.innerHTML = ''; const op = window.currentOp || '+'; 
        const data = BEAST_DATA[op] || BEAST_DATA['+'];
        
        // Update Side Label
        const labelId = containerId === 'leftBeastArea' ? 'leftOpLabel' : 'rightOpLabel';
        const labelEl = document.getElementById(labelId);
        if (labelEl) {
            labelEl.textContent = data.name;
            labelEl.style.textShadow = `0 0 10px var(--theme-glow)`;
        }

        for (let i = 0; i < n; i++) {
            const div = document.createElement('div'); 
            div.className = 'beast-wrapper flex flex-col items-center opacity-0 transition-all duration-500 scale-50';
            div.innerHTML = `<div class="beast-icon text-[50px] drop-shadow-[0_0_10px_var(--theme-glow)]">${data.icon}</div>`;
            container.appendChild(div); 
            setTimeout(() => { div.classList.remove('opacity-0', 'scale-50'); div.classList.add('opacity-100', 'scale-100'); }, i * 50);
        }
    }

    // --- 3. Starfire Particles ---
    const canvas = document.getElementById('starfire-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; updateResonancePaths(); }
    window.addEventListener('resize', resize); resize();
    class Starfire { constructor(x, y) { this.x = x; this.y = y; this.vx = (Math.random() - 0.5) * 8; this.vy = (Math.random() - 0.5) * 8; this.life = 1.0; this.size = Math.random() * 3 + 2; } update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.98; this.vy *= 0.98; this.life -= 0.01; } draw() { ctx.globalAlpha = this.life; ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } }
    function spawn(x, y, count) { for (let i = 0; i < count; i++) particles.push(new Starfire(x, y)); }
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles = particles.filter(p => p.life > 0); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
    animate();

    // --- 4. 3D Gear Wheel ---
    class GearWheel {
        constructor(id, onValueChange) { this.el = document.getElementById(id); this.angle = 0; this.currentValue = 0; this.onValueChange = onValueChange; this.deltaAccumulator = 0; this.isJumping = false; this.initFaces(); this.run(); }
        initFaces() { this.el.innerHTML = ''; const radius = 277; for (let i = 0; i < 10; i++) { const face = document.createElement('div'); face.className = 'wheel-face'; face.textContent = i; const faceAngle = i * -36; face.style.transform = `rotateX(${faceAngle}deg) translateZ(${radius}px)`; this.el.appendChild(face); } }
        handleWheel(delta) { this.deltaAccumulator += delta; if (Math.abs(this.deltaAccumulator) >= 50 && !this.isJumping) { this.jump(Math.sign(this.deltaAccumulator)); this.deltaAccumulator = 0; } }
        jump(steps) { if (this.isJumping) return; this.isJumping = true; this.angle += steps * 36; setTimeout(() => { this.isJumping = false; }, 200); }
        run() {
            const target = Math.round(this.angle / 36) * 36; this.angle += (target - this.angle) * 0.3;
            const rawVal = (Math.round(this.angle / 36) % 10 + 10) % 10; const val = (10 - rawVal) % 10;
            if (val !== this.currentValue) {
                this.currentValue = val; playGearRotation(); if (this.onValueChange) this.onValueChange(val);
                const rect = this.el.getBoundingClientRect(); spawn(rect.left + rect.width / 2, rect.top + rect.height / 2, val + 2);
            }
            this.el.style.transform = `rotateX(${-this.angle}deg)`; requestAnimationFrame(() => this.run());
        }
    }

    // --- 5. Initialization ---
    let leftGear, rightGear; window.currentOp = '+';
    function init() {
        leftGear = new GearWheel('leftWheel', (val) => { renderBeasts(val, 'leftBeastArea'); update(); });
        rightGear = new GearWheel('rightWheel', (val) => { renderBeasts(val, 'rightBeastArea'); update(); });
        const leftCont = document.getElementById('leftGearContainer'); const rightCont = document.getElementById('rightGearContainer');
        leftCont.onwheel = e => { e.preventDefault(); leftGear.handleWheel(e.deltaY); }; rightCont.onwheel = e => { e.preventDefault(); rightGear.handleWheel(e.deltaY); };
        document.querySelectorAll('.gear-btn').forEach(btn => { btn.onclick = () => { const id = btn.getAttribute('data-id'); const dir = parseInt(btn.getAttribute('data-dir')); if (id === 'leftWheel') leftGear.jump(dir); if (id === 'rightWheel') rightGear.jump(dir); }; });
        document.querySelectorAll('.op-btn').forEach(btn => {
            btn.onclick = () => {
                const op = btn.getAttribute('data-op');
                document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
                window.currentOp = op; 
                
                // Update Theme
                document.body.classList.remove('theme-add', 'theme-sub', 'theme-mul', 'theme-div');
                if (op === '+') document.body.classList.add('theme-add');
                else if (op === '-') document.body.classList.add('theme-sub');
                else if (op === '×') document.body.classList.add('theme-mul');
                else if (op === '÷') document.body.classList.add('theme-div');

                playOpSound(window.currentOp);
                renderBeasts(leftGear.currentValue, 'leftBeastArea'); renderBeasts(rightGear.currentValue, 'rightBeastArea');
                update();
            };
        });
        document.body.classList.add('theme-add'); // Default
        setTimeout(updateResonancePaths, 500); update();
    }
    function update() {
        const n1 = leftGear ? leftGear.currentValue : 0; const n2 = rightGear ? rightGear.currentValue : 0;
        if (window.SoulEngine) { window.SoulEngine.react(n1, n2, window.currentOp); }
        const result = calculate(n1, n2, window.currentOp);
        const resDisp = document.getElementById('resultValue'); if (resDisp) resDisp.textContent = result;
        logDiscovery(n1, n2, window.currentOp, result);
    }
    function calculate(n1, n2, op) {
        if (op === '+') return n1 + n2; if (op === '-') return n1 - n2; if (op === '×') return n1 * n2;
        if (op === '÷') return n2 === 0 ? '∞' : (n1 / n2).toFixed(1).replace(/\.0$/, '');
        return '?';
    }
    window.onload = init;
})();
