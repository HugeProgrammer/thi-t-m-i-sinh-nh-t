import { useState } from 'react';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [fallingElements, setFallingElements] = useState([]);
  const [noCount, setNoCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [cakeHearts, setCakeHearts] = useState([]);

  // ✨ NEW: Thuật toán tạo hình Trái Tim 3D từ 80 chữ "I love you" (ĐÃ PHÓNG TO & TĂNG SỐ LƯỢNG)
  const [heart3D] = useState(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const t = (i / 80) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const z = Math.sin(t * 4) * 35; // Tăng độ sâu 3D

      const dx = 48 * Math.pow(Math.sin(t), 2) * Math.cos(t);
      const dy = -(-13 * Math.sin(t) + 10 * Math.sin(2 * t) + 6 * Math.sin(3 * t) + 4 * Math.sin(4 * t));
      const rotZ = Math.atan2(dy, dx) * (180 / Math.PI);

      // Tăng số nhân từ 7.5 lên 14 để dải trái tim to bành ra vượt ngoài khung thẻ
      return { id: i, x: x * 14, y: y * 14, z: z, rotZ: rotZ }; 
    });
  });

  const [bgStars] = useState(() => 
    Array.from({ length: 35 }).map((_, i) => ({ 
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 3
    }))
  );

  const [driftingItems] = useState(() => {
    const itemsPool = ['🦋', '💖', '💙', '🦋', '💖', '✨'];
    return Array.from({ length: 60 }).map((_, i) => ({ 
      id: i,
      char: itemsPool[Math.floor(Math.random() * itemsPool.length)],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 5 + 4,
      size: Math.random() * 22 + 15
    }));
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCakeHover = () => {
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({ 
      id: Date.now() + i,
      left: Math.random() * 60 + 20,
      delay: Math.random() * 0.4,
      size: Math.random() * 14 + 12,
      xDrift: Math.random() * 80 - 40 
    }));
    setCakeHearts(newHearts);
    setTimeout(() => setCakeHearts([]), 2000);
  };

  const rsvpPhrases = [
    "Nàng công chúa có đồng ý đi đón tuổi mới cùng anh hong? 🥰",
    "Ơi suy nghĩ lại đi bé 🥺",
    "Đi đi mà sinh nhật anh mà không có em thì sao gọi là sinh nhật được 😭",
    "Ai cho em ở từ chối :))))))"
  ];

  const getYesButtonText = () => {
    const texts = [
      "Yesss, em đồng ý! ❤️",
      "Thôi được rồi, em đi! 🥰",
      "Đi chứ sao không, thương anh nhất ❤️",
      "Đồng ý luôn (Lựa chọn duy nhất rồi) 👑"
    ];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  const getNoButtonText = () => {
    const texts = ["Không nha 😜", "Vẫn không đi 😤", "Nhất quyết không đi 🙄", ""];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleYesClick = () => {
    const items = ['✨', '🦋', '💙', '🌸', '💖', '👑', '🎈', '🎉', '🎁'];
    const newElements = Array.from({ length: 180 }).map((_, i) => ({ 
      id: i,
      char: items[Math.floor(Math.random() * items.length)],
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      size: Math.random() * 32 + 15,
    }));
    setFallingElements(newElements);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased overflow-x-hidden relative font-sans">
      
      <style>{`
        /* ✨ CSS HOẠT HỌA CHO TRÁI TIM 3D CHỮ I LOVE YOU */
        @keyframes spin3DHeart {
          0% { transform: perspective(1000px) rotateY(0deg) rotateX(10deg); }
          100% { transform: perspective(1000px) rotateY(360deg) rotateX(10deg); }
        }
        .heart-3d-wrapper {
          transform-style: preserve-3d;
          animation: spin3DHeart 18s linear infinite;
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes gentleFloatDelayed {
          0%, 100% { transform: translateY(-6px) rotate(-1deg); }
          50% { transform: translateY(8px) rotate(1.5deg); }
        }
        @keyframes starGlow {
          0%, 100% { opacity: 0.2; transform: scale(0.8); filter: blur(0.5px); }
          50% { opacity: 1; transform: scale(1.4); filter: blur(0px); }
        }
        @keyframes driftBackground {
          0% { transform: translate(-50px, 110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translate(100vw, -10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes elementRise {
          0% { transform: translateY(110vh) rotate(0deg) scale(0.5); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(720deg) scale(1.4); opacity: 0; }
        }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cardShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px) rotate(-1deg); }
          40%, 80% { transform: translateX(8px) rotate(1deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.5); }
        }
        @keyframes rotateWings {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes balloonSway {
          0%, 100% { transform: translateY(0) rotate(-4deg) scale(1); }
          50% { transform: translateY(-20px) rotate(6deg) scale(1.05); }
        }
        @keyframes cakeHeartRise {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-110px) translateX(var(--x-drift, 20px)) scale(1.4); opacity: 0; }
        }
        @keyframes avatarNeon {
          0%, 100% { box-shadow: 0 0 25px #f59e0b, 0 0 50px #db2777; filter: hue-rotate(0deg); }
          50% { box-shadow: 0 0 45px #fbbf24, 0 0 80px #f472b6; filter: hue-rotate(15deg); }
        }
        @keyframes cardPopIn {
          0% { transform: translateY(50px) scale(0.95); opacity: 0; filter: blur(4px); }
          100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0px); }
        }
        @keyframes mobileCakeBounce {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.08, 0.93) translateY(-10px); }
        }
        @keyframes mobileBtnBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

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
        
        .shimmer-text {
          background: linear-gradient(to right, #b45309, #db2777, #d97706, #b45309);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 3.5s linear infinite;
        }
        .gold-border-glow {
          box-shadow: 0 20px 50px rgba(217, 119, 6, 0.12), inset 0 0 15px rgba(251, 191, 36, 0.1);
        }
      `}</style>

      {/* HÌNH NỀN CẨM THẠCH ĐỘNG */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-95"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.3px]"></div>

        {/* ✨ GIAO DIỆN TRÁI TIM 3D (ĐÃ TĂNG SIZE, TĂNG ĐẬM MÀU HỒNG ĐỂ NỔI BẬT) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85 z-0">
          <div className="heart-3d-wrapper relative w-0 h-0">
            {heart3D.map(w => (
              <div
                key={w.id}
                className="absolute font-extrabold whitespace-nowrap text-[13px] md:text-lg tracking-widest"
                style={{
                  color: '#db2777', // Đổi sang màu hồng cực đậm
                  textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 15px rgba(219,39,119,0.5)',
                  top: '-0.5em', left: '-2.5em',
                  transform: `translate3d(${w.x}px, ${w.y}px, ${w.z}px) rotateZ(${w.rotZ}deg)`,
                }}
              >
                I love you
              </div>
            ))}
          </div>
        </div>

        {bgStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-amber-300 shadow-[0_0_15px_#fbbf24] animate-glow"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              '--dur': `${star.duration}s`
            }}
          />
        ))}

        {driftingItems.map((item) => (
          <div
            key={item.id}
            className="absolute animate-drift text-slate-400 select-none"
            style={{ left: `${item.left}%`, animationDelay: `${item.delay}s`, '--dur': `${item.duration}s`, fontSize: `${item.size}px` }}
          >
            {item.char}
          </div>
        ))}
      </div>

      {/* ================= TRANG 1 ================= */}
      <section id="page1" className="h-screen w-full flex flex-col items-center justify-center relative p-6 z-10">
        <div className="text-center max-w-xl flex flex-col items-center bg-white/65 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/70 shadow-2xl gold-border-glow transform transition-all duration-500 animate-card-pop">
          <p className="text-xs tracking-[0.35em] text-amber-700 font-bold uppercase mb-4 drop-shadow-sm animate-pulse">Join us for a birthday party</p>
          <h1 className="text-3xl md:text-5xl font-serif italic font-normal mb-8 leading-tight shimmer-text">
            Princess is turning beautiful 💙
          </h1>
          
          <div className="my-2 relative flex justify-center items-center shrink-0 animate-float">
            <div className="absolute w-72 h-72 border-2 border-dashed border-amber-300/40 rounded-full animate-rotate pointer-events-none"></div>
            <div className="absolute -top-6 left-2 text-4xl animate-float z-20">🦋</div>
            <div className="absolute top-16 -right-6 text-4xl animate-float z-20" style={{ animationDelay: '1.5s' }}>🦋</div>
            
            <div className="w-60 h-60 md:w-68 md:h-68 rounded-full border-8 border-amber-100/90 shadow-2xl overflow-hidden p-1 bg-white shrink-0 transition-transform duration-300 animate-avatar-neon">
              <img 
                src="/avt4.jpg" 
                alt="Princess" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <button 
            onClick={() => scrollToSection('page2')}
            className="mt-8 px-10 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-bold text-lg rounded-full shadow-lg shadow-amber-600/40 transform transition-all duration-300 cursor-pointer animate-mobile-btn animate-pulse-glow"
          >
            Em bé bấm vào đây để xem thiệp mời nha ✨
          </button>
        </div>
      </section>

      {/* ================= TRANG 2: PREMIUM & CUTE CELEBRATION ================= */}
      <section id="page2" className="h-screen w-full flex flex-col items-center justify-center relative p-6 z-10">
        
        <div className="bg-white/65 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(180,120,40,0.15)] border-2 border-white/80 max-w-xl w-full text-center mb-10 transform transition-all duration-500 gold-border-glow relative overflow-hidden animate-pulse-glow animate-card-pop">
          
          <div className="absolute -top-4 -left-4 text-3xl opacity-20 select-none">🌸</div>
          <div className="absolute -top-4 -right-4 text-3xl opacity-20 select-none">🌸</div>

          <p className="text-xs uppercase tracking-[0.45em] text-amber-700 font-bold mb-3 opacity-80">Let's celebrate</p>
          <h2 className="text-3xl md:text-4xl font-serif italic mb-6 tracking-wide shimmer-text font-normal">Our Sweet Date</h2>
          
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8 animate-pulse"></div>
          
          <div className="space-y-6 text-base text-slate-700 leading-relaxed font-medium">
            <p className="text-slate-800 tracking-wide md:px-4">
              Thân mời <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md shadow-inner">Công Chúa xinh đẹp</span> đến dự sinh nhật cùng anh
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 px-2">
              
              <div className="bg-white/60 border border-amber-200/50 rounded-2xl p-4 shadow-md bg-amber-50/40 animate-float flex flex-col items-center">
                <span className="inline-block text-xl mb-1">⏰</span>
                <span className="block text-amber-700 tracking-widest text-[11px] uppercase font-bold mb-1">Thời gian</span>
                <span className="text-slate-900 font-bold text-base">Ngày 13/06 19:00 • Thứ Bảy</span>
              </div>
              
              <div className="bg-white/60 border border-amber-200/50 rounded-2xl p-4 shadow-md bg-sky-50/40 animate-float-delayed flex flex-col items-center">
                <span className="inline-block text-xl mb-1">📍</span>
                <span className="block text-amber-700 tracking-widest text-[11px] uppercase font-bold mb-1">Địa điểm</span>
                <span className="text-slate-900 font-bold text-base">Hadilao Vạn Hạnh Mall</span>
              </div>

            </div>
          </div>

          <div className="relative inline-block mt-8 animate-cake-loop">
            {cakeHearts.map(h => (
              <div 
                key={h.id} 
                className="absolute text-pink-500 animate-cake-heart select-none pointer-events-none"
                style={{ 
                  left: `${h.left}%`, 
                  animationDelay: `${h.delay}s`, 
                  fontSize: `${h.size}px`, 
                  bottom: '40px', 
                  '--x-drift': `${h.xDrift}px` 
                }}
              >
                ❤️
              </div>
            ))}
            <div 
              onClick={handleCakeHover}
              className="text-5xl drop-shadow-sm cursor-pointer select-none"
            >
              🎂
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-12 text-5xl opacity-85 animate-balloon">🎈🎈</div>
        <div className="absolute bottom-24 right-12 text-5xl opacity-85 animate-balloon" style={{ animationDelay: '2.5s' }}>🎈🎈</div>

        <button 
          onClick={() => scrollToSection('page3')}
          className="px-8 py-3 bg-white/95 text-amber-700 border border-amber-200 font-bold text-xs tracking-widest uppercase rounded-full shadow-md transform transition-all duration-300 z-10 cursor-pointer animate-mobile-btn animate-pulse"
        >
          Cục dàng đồng ý đi với anh nha 👇
        </button>
      </section>

      {/* ================= TRANG 3: KỊCH BẢN THƯƠNG LƯỢNG ================= */}
      <section id="page3" className="h-screen w-full flex flex-col items-center justify-center relative p-6 z-10">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {fallingElements.map((el) => (
            <div key={el.id} className="absolute animate-rise" style={{ left: `${el.left}%`, animationDelay: `${el.delay}s`, fontSize: `${el.size}px`, bottom: '-50px' }}>
              {el.char}
            </div>
          ))}
        </div>

        <div className={`text-center max-w-xl flex flex-col items-center bg-white/65 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/60 shadow-2xl gold-border-glow mx-4 transition-all duration-500 animate-card-pop ${isShaking ? 'animate-shake' : ''}`}>
          <div className="text-6xl mb-6 animate-float">👑</div>
          
          <h2 className="text-xl md:text-2xl font-bold text-amber-950 mb-12 leading-relaxed tracking-wide h-20 flex items-center justify-center transition-all duration-300">
            {rsvpPhrases[Math.min(noCount, rsvpPhrases.length - 1)]}
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-4 min-h-[100px]">
            <button 
              onClick={handleYesClick}
              style={{ transform: `scale(${1 + noCount * 0.15})` }}
              className={`px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-white font-bold rounded-full shadow-xl active:scale-95 transition-all duration-300 cursor-pointer w-full sm:w-auto text-base whitespace-nowrap z-10 animate-mobile-btn ${noCount > 0 ? 'animate-pulse-glow' : ''}`}
            >
              {getYesButtonText()}
            </button>

            {noCount < 3 && (
              <button 
                onClick={handleNoClick}
                className="px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-base rounded-full shadow-md transition-all duration-200 cursor-pointer w-full sm:w-auto whitespace-nowrap active:scale-90"
              >
                {getNoButtonText()}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= SUCCESS MODAL POPUP ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 border-4 border-amber-100 rounded-[2.5rem] p-8 md:p-12 text-center max-w-sm w-full shadow-2xl relative">
            <span className="text-6xl block mb-4 animate-bounce">🦋✨</span>
            <h3 className="text-2xl font-serif italic text-amber-600 mb-3 tracking-wider">Yêu Em Nhiều Nhất!</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
              Anh cảm ơn công chúa đã đồng ý đi sinh nhật anh nha 
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-full shadow-md transition-all text-sm cursor-pointer animate-pulse-glow animate-mobile-btn"
            >
              Hẹn gặp em bé vào thứ Bảy 🙈
            </button>
          </div>
        </div>
      )}
    </div>
  );
}