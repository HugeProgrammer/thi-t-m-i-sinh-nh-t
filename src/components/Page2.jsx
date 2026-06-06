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
    // ✨ Đã đổi thành min-h-[100dvh] và thêm padding y (py-16) để không bị lẹm viền màn hình
    <section id="page2" className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative p-4 md:p-6 py-16 z-10">
      
      {/* ✨ Thu nhỏ padding và border radius trên mobile */}
      <div className="bg-white/65 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-[0_30px_70px_rgba(180,120,40,0.15)] border-2 border-white/80 max-w-xl w-full text-center mb-6 md:mb-10 transform transition-all duration-500 gold-border-glow relative overflow-hidden animate-pulse-glow animate-card-pop">
        
        <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 text-2xl md:text-3xl opacity-20 select-none">🌸</div>
        <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 text-2xl md:text-3xl opacity-20 select-none">🌸</div>

        <p className="text-[10px] md:text-xs uppercase tracking-[0.45em] text-amber-700 font-bold mb-3 opacity-80">A SPECIAL DAY</p>
        <h2 className="text-2xl md:text-4xl font-serif italic mb-6 tracking-wide shimmer-text font-normal">Growing Older With You</h2>
        
        <div className="w-20 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6 md:mb-8 animate-pulse"></div>
        
        <div className="space-y-4 md:space-y-6 text-sm md:text-base text-slate-700 leading-relaxed font-medium">
          <p className="text-slate-800 tracking-wide px-2 md:px-4">
            Thân mời <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md shadow-inner">Công Chúa xinh đẹp</span> đến dự sinh nhật cùng anh
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-2 px-1">
            <div className="bg-white/60 border border-amber-200/50 rounded-2xl p-3 md:p-4 shadow-md bg-amber-50/40 animate-float flex flex-col items-center">
              <span className="inline-block text-xl mb-1">⏰</span>
              <span className="block text-amber-700 tracking-widest text-[10px] md:text-[11px] uppercase font-bold mb-1">Thời gian</span>
              <span className="text-slate-900 font-bold text-sm md:text-base">Ngày 6/6 19:00 • Thứ Bảy</span>
            </div>
            
            <div className="bg-white/60 border border-amber-200/50 rounded-2xl p-3 md:p-4 shadow-md bg-sky-50/40 animate-float-delayed flex flex-col items-center">
              <span className="inline-block text-xl mb-1">📍</span>
              <span className="block text-amber-700 tracking-widest text-[10px] md:text-[11px] uppercase font-bold mb-1">Địa điểm</span>
              <span className="text-slate-900 font-bold text-sm md:text-base">Haidilao Vạn Hạnh Mall</span>
            </div>
          </div>
        </div>

        <div className="relative inline-block mt-6 md:mt-8 animate-cake-loop">
          {cakeHearts.map(h => (
            <div 
              key={h.id} 
              className="absolute text-pink-500 animate-cake-heart select-none pointer-events-none"
              style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, fontSize: `${h.size}px`, bottom: '40px', '--x-drift': `${h.xDrift}px` }}
            >
              ❤️
            </div>
          ))}
          <div onClick={handleCakeHover} className="text-4xl md:text-5xl drop-shadow-sm cursor-pointer select-none">🎂</div>
        </div>
      </div>

      <div className="absolute bottom-16 left-4 md:bottom-20 md:left-12 text-4xl md:text-5xl opacity-85 animate-balloon">🎈🎈</div>
      <div className="absolute bottom-24 right-4 md:bottom-28 md:right-12 text-4xl md:text-5xl opacity-85 animate-balloon" style={{ animationDelay: '2.5s' }}>🎈🎈</div>

      {/* ✨ Đẩy nút bấm lên trên một chút để không bị dính sát đáy điện thoại */}
      <button 
        onClick={onNext}
        className="mb-4 md:mb-0 px-6 md:px-8 py-3 md:py-4 bg-white/95 text-amber-700 border border-amber-200 font-bold text-[10px] md:text-xs tracking-widest uppercase rounded-full shadow-md transform transition-all duration-300 z-10 cursor-pointer animate-mobile-btn animate-pulse w-[90%] sm:w-auto"
      >
        Cục dàng đồng ý đi với anh nha 👇
      </button>
    </section>
  );
}