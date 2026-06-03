import { useState } from 'react';

export default function Page2({ onNext }) {
  const [cakeHearts, setCakeHearts] = useState([]);

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

  return (
    <section id="page2" className="h-screen w-full flex flex-col items-center justify-center relative p-6 z-10">
      <div className="bg-white/65 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(180,120,40,0.15)] border-2 border-white/80 max-w-xl w-full text-center mb-10 transform transition-all duration-500 gold-border-glow relative overflow-hidden animate-pulse-glow animate-card-pop">
        
        <div className="absolute -top-4 -left-4 text-3xl opacity-20 select-none">🌸</div>
        <div className="absolute -top-4 -right-4 text-3xl opacity-20 select-none">🌸</div>

        <p className="text-xs uppercase tracking-[0.45em] text-amber-700 font-bold mb-3 opacity-80">A SPECIAL DAY</p>
        <h2 className="text-3xl md:text-4xl font-serif italic mb-6 tracking-wide shimmer-text font-normal">Growing Older With You</h2>
        
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
          <div onClick={handleCakeHover} className="text-5xl drop-shadow-sm cursor-pointer select-none">🎂</div>
        </div>
      </div>

      <div className="absolute bottom-16 left-12 text-5xl opacity-85 animate-balloon">🎈🎈</div>
      <div className="absolute bottom-24 right-12 text-5xl opacity-85 animate-balloon" style={{ animationDelay: '2.5s' }}>🎈🎈</div>

      <button 
        onClick={onNext}
        className="px-8 py-3 bg-white/95 text-amber-700 border border-amber-200 font-bold text-xs tracking-widest uppercase rounded-full shadow-md transform transition-all duration-300 z-10 cursor-pointer animate-mobile-btn animate-pulse"
      >
        Cục dàng đồng ý đi với anh nha 👇
      </button>
    </section>
  );
}