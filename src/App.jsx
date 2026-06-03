import { useState, useRef, useEffect } from 'react';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log("Lỗi tự động phát nhạc:", e));
    }
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log(err));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const sendNotification = async (action, message) => {
    const webhookUrl = "https://n8n.beedo.ai.vn/webhook/35679264-1dae-403e-b60d-1cd2bc85e0c2"; 
    if (!webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          khach_moi: "Công Chúa",
          hanh_dong: action,
          chi_tiet_cau_tra_loi: message,
          thoi_gian: new Date().toLocaleString('vi-VN')
        })
      });
    } catch (error) {
      console.log("Không thể gửi thông báo:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [heart3D] = useState(() => {
    return Array.from({ length: 120 }).map((_, i) => {
      const t = (i / 120) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const z = Math.sin(t * 4) * 45; 
      const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
      const dy = -(-13 * Math.sin(t) + 10 * Math.sin(2 * t) + 6 * Math.sin(3 * t) + 4 * Math.sin(4 * t));
      const rotZ = Math.atan2(dy, dx) * (180 / Math.PI);
      return { id: i, x: x * 20, y: y * 20, z: z, rotZ: rotZ }; 
    });
  });

  const [bgStars] = useState(() => 
    Array.from({ length: 35 }).map((_, i) => ({ 
      id: i, top: Math.random() * 100, left: Math.random() * 100,
      size: Math.random() * 6 + 3, delay: Math.random() * 3, duration: Math.random() * 3 + 3
    }))
  );

  const [driftingItems] = useState(() => {
    const itemsPool = ['🦋', '💖', '💙', '🦋', '💖', '✨'];
    return Array.from({ length: 60 }).map((_, i) => ({ 
      id: i, char: itemsPool[Math.floor(Math.random() * itemsPool.length)],
      left: Math.random() * 100, delay: Math.random() * 8,
      duration: Math.random() * 5 + 4, size: Math.random() * 22 + 15
    }));
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div onClick={playMusic} className="min-h-screen text-slate-800 antialiased overflow-x-hidden relative font-sans">
      <style>{`
        /* Giữ nguyên toàn bộ CSS của bạn ở đây */
        @keyframes spin3DHeart { 0% { transform: perspective(1000px) rotateY(0deg) rotateX(10deg); } 100% { transform: perspective(1000px) rotateY(360deg) rotateX(10deg); } }
        .heart-3d-wrapper { transform-style: preserve-3d; animation: spin3DHeart 18s linear infinite; }
        @keyframes gentleFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
        @keyframes gentleFloatDelayed { 0%, 100% { transform: translateY(-6px) rotate(-1deg); } 50% { transform: translateY(8px) rotate(1.5deg); } }
        @keyframes starGlow { 0%, 100% { opacity: 0.2; transform: scale(0.8); filter: blur(0.5px); } 50% { opacity: 1; transform: scale(1.4); filter: blur(0px); } }
        @keyframes driftBackground { 0% { transform: translate(-50px, 110vh) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate(100vw, -10vh) rotate(360deg); opacity: 0; } }
        @keyframes elementRise { 0% { transform: translateY(110vh) rotate(0deg) scale(0.5); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(-10vh) rotate(720deg) scale(1.4); opacity: 0; } }
        @keyframes textShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes cardShake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px) rotate(-1deg); } 40%, 80% { transform: translateX(8px) rotate(1deg); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); } 50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.5); } }
        @keyframes rotateWings { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes balloonSway { 0%, 100% { transform: translateY(0) rotate(-4deg) scale(1); } 50% { transform: translateY(-20px) rotate(6deg) scale(1.05); } }
        @keyframes cakeHeartRise { 0% { transform: translateY(0) scale(0.4); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(-110px) translateX(var(--x-drift, 20px)) scale(1.4); opacity: 0; } }
        @keyframes avatarNeon { 0%, 100% { box-shadow: 0 0 25px #f59e0b, 0 0 50px #db2777; filter: hue-rotate(0deg); } 50% { box-shadow: 0 0 45px #fbbf24, 0 0 80px #f472b6; filter: hue-rotate(15deg); } }
        @keyframes cardPopIn { 0% { transform: translateY(50px) scale(0.95); opacity: 0; filter: blur(4px); } 100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); } }
        @keyframes mobileCakeBounce { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.08, 0.93) translateY(-10px); } }
        @keyframes mobileBtnBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        .animate-float { animation: gentleFloat 4s infinite ease-in-out; }
        .animate-float-delayed { animation: gentleFloatDelayed 3.5s infinite ease-in-out; }
        .animate-glow { animation: starGlow var(--dur) infinite ease-in-out; }
        .animate-drift { animation: driftBackground var(--dur) infinite linear; }
        .animate-rise { animation: elementRise 4.2s forwards linear; }
        .animate-shake { animation: cardShake 0.4s ease-in-out; }
        .animate-pulse-glow { animation: pulseGlow 2.5s infinite ease-in-out; }
        .animate-rotate { animation: rotateWings 22s infinite linear; }
        .animate-balloon { animation: balloonSway 4.5s infinite ease-in-out; }
        .animate-cake-heart { animation: cakeHeartRise 1.4s forwards ease-out; }
        .animate-avatar-neon { animation: avatarNeon 5s infinite ease-in-out; }
        .animate-card-pop { animation: cardPopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-cake-loop { animation: mobileCakeBounce 2.5s infinite ease-in-out; }
        .animate-mobile-btn { animation: mobileBtnBreathe 2s infinite ease-in-out; }
        .shimmer-text { background: linear-gradient(to right, #b45309, #db2777, #d97706, #b45309); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textShimmer 3.5s linear infinite; }
        .gold-border-glow { box-shadow: 0 20px 50px rgba(217, 119, 6, 0.12), inset 0 0 15px rgba(251, 191, 36, 0.1); }
      `}</style>
      
      <audio ref={audioRef} src="./done.mp3" loop preload="auto" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      <button onClick={toggleMusic} className="fixed top-4 right-4 z-50 w-11 h-11 bg-white/60 backdrop-blur-md border border-white/60 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse-glow" title="Bật/Tắt Nhạc">{isPlaying ? '🎵' : '🔇'}</button>
      
      <div className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-95" style={{ backgroundImage: "url('./background.jpg')" }}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.3px]"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-85 z-0">
          <div className="heart-3d-wrapper relative w-0 h-0">
            {heart3D.map(w => (
              <div key={w.id} className="absolute font-extrabold whitespace-nowrap text-[13px] md:text-lg tracking-widest" style={{ color: '#db2777', textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 15px rgba(219,39,119,0.5)', top: '-0.5em', left: '-2.5em', transform: `translate3d(${w.x}px, ${w.y}px, ${w.z}px) rotateZ(${w.rotZ}deg)` }}>I love you</div>
            ))}
          </div>
        </div>
        {bgStars.map((star) => (
          <div key={star.id} className="absolute rounded-full bg-amber-300 shadow-[0_0_15px_#fbbf24] animate-glow" style={{ top: `${star.top}%`, left: `${star.left}%`, width: `${star.size}px`, height: `${star.size}px`, animationDelay: `${star.delay}s`, '--dur': `${star.duration}s` }} />
        ))}
        {driftingItems.map((item) => (
          <div key={item.id} className="absolute animate-drift text-slate-400 select-none" style={{ left: `${item.left}%`, animationDelay: `${item.delay}s`, '--dur': `${item.duration}s`, fontSize: `${item.size}px` }}>{item.char}</div>
        ))}
      </div>

      {/* Gọi các component con và truyền hàm điều khiển xuống */}
      <Page1 onNext={() => { scrollToSection('page2'); playMusic(); }} />
      <Page2 onNext={() => scrollToSection('page3')} />
      <Page3 playMusic={playMusic} sendNotification={sendNotification} />

    </div>
  );
}