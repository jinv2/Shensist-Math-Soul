/**
 * soul.js - The Narrative Soul (AI Agent Core)
 * Handles atmospheric changes, AI dialogue, memory, and creative questioning.
 */

window.SoulEngine = (function() {
    "use strict";

    const AI_TEXT_ID = 'ai-text';
    const QUESTION_MODE_ID = 'question-mode';

    const memory = {
        history: [],
        operationsCount: 0,
        lastTheme: null
    };

    const RESPONSES = {
        giant: [
            "喔！你制造了一个数字巨兽，它快要把屏幕挤爆了！",
            "数字的力量正在溢出，这股能量足以唤醒沉睡的山海神兽。",
            "这就是所谓的‘无穷’在现实中的投影吗？",
            "巨大的数位，正在重塑这片荒原的重力。"
        ],
        twins: [
            "这是一对孪生兄弟，它们在一起是某种奇妙的平衡。",
            "阴阳合德，双数齐整，这是万物和谐的征兆。",
            "相同的频率，相同的位格，在理性的天平上两端持平。",
            "双生之灵，正在产生共鸣。"
        ],
        abyss: [
            "数字跌入了虚无之下的真实，你触碰到了‘负’的大荒。",
            "这里的空气凝结了，负数是万物背面的投影。",
            "你正在见证‘无’之下的深渊，那是冰封的数理地下室。",
            "寒冷的气息……负数并不是终点，而是另一个宇宙的起点。"
        ],
        zero: [
            "归零，一切回到了混沌未分的时刻。",
            "这是万物的起点，也是终极的归宿。",
            "零是大荒的留白，等待你下一次的挥毫。",
            "寂静无声，零之圆满。"
        ],
        standard: [
            "数理的脉络在你的指尖流动。",
            "齿轮咬合，又一个宇宙的真理被揭示。",
            "山海之间，数学是唯一的通用语言。",
            "你在寻找什么样的答案？或许答案就在过程之中。",
            "我是灵机，见证着你对秩序的探索。"
        ],
        wisdom: [
            "你已经拨动了齿轮多次，大荒的秘密正在向你敞开。",
            "每一个数字都是一个独立的位格，你正在编织它们的命运。",
            "不要被结果束缚，感受齿轮转动时的那种机械韵律。"
        ]
    };

    const QUESTIONS = [
        "你能用这两个数字编一个关于‘守护山海兽’的小故事吗？",
        "如果你有这些粒子火种，你想用它们照亮哪一座神山？",
        "如果你是这个数字的守护者，你会赋予它什么样的性格？",
        "在这个数字的循环中，你听到了什么样的机械心跳？",
        "这些数字如果是一种颜色，你觉得它们是什么颜色？"
    ];

    function typeText(text) {
        const el = document.getElementById(AI_TEXT_ID);
        if (el) {
            el.style.opacity = '0';
            setTimeout(() => {
                el.textContent = text;
                el.style.opacity = '1';
            }, 300);
        }
    }

    function react(n1, n2, op) {
        let result;
        if (op === '+') result = n1 + n2;
        else if (op === '-') result = n1 - n2;
        else if (op === '×') result = n1 * n2;
        else if (op === '÷') result = n2 === 0 ? Infinity : n1 / n2;

        memory.history.push({n1, n2, op, result});
        memory.operationsCount++;
        if (memory.history.length > 10) memory.history.shift();

        document.body.classList.remove('scene-abyss', 'scene-giant');

        let theme = 'standard';
        if (result < 0) {
            document.body.classList.add('scene-abyss');
            theme = 'abyss';
        } else if (result > 15 || (op === '×' && result > 50)) {
            document.body.classList.add('scene-giant');
            theme = 'giant';
        } else if (n1 === n2 && n1 !== 0) {
            theme = 'twins';
        } else if (result === 0) {
            theme = 'zero';
        } else if (memory.operationsCount > 5 && Math.random() > 0.7) {
            theme = 'wisdom';
        }

        const pool = RESPONSES[theme] || RESPONSES.standard;
        typeText(pool[Math.floor(Math.random() * pool.length)]);

        const qMode = document.getElementById(QUESTION_MODE_ID);
        if (qMode) {
            qMode.style.opacity = (n1 !== 0 || n2 !== 0) ? '1' : '0';
            if (Math.random() > 0.9) {
                const qText = qMode.querySelector('p');
                if (qText) qText.textContent = `“${QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}”`;
            }
        }

        return theme.toUpperCase(); // Return state for the Intelligence Stream
    }

    return { react };

})();
