import { useState } from 'react';

// Danh sách ảnh 
const memories = [
  { img: './anh9.jpg' },
  { img: './anh8.jpg' },
  { img: './anh3.jpg' }, 
  { img: './anh4.jpg' },
  { img: './anh5.jpg' },
  { img: './anh6.jpg' },
  { img: './anh7.jpg' }
];

export default function MemoryPage({ onNext }) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < memories.length - 1) {
      setCurrent(current + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  return (
    // ✨ Đổi thành min-h-[100dvh] và thêm py-16 để giao diện tự giãn không bị tràn
    <section id="memory" className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-6 py-16 z-10 relative">
      
      {/* ✨ Giảm padding trên mobile (p-6) */}
        <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl max-w-md w-full text-center animate-card-pop gold-border-glow">
        
        <h2 className="text-xl md:text-2xl font-bold text-amber-800 mb-2 md:mb-4 animate-pulse">Cherished Moments with My Baby</h2>
        
        {/* ✨ Giảm chiều cao tối thiểu trên mobile */}
        <div key={current} className="animate-card-pop flex flex-col items-center justify-center w-full min-h-[240px] md:min-h-[320px]">
          
<div className="my-4 md:my-8 relative flex justify-center items-center shrink-0 animate-float">
            
            {/* ✨ Viền đứt đoạn: Tăng từ md:w-72 lên md:w-80 (to ra) */}
            <div className="absolute w-56 h-56 md:w-80 md:h-80 border-2 border-dashed border-amber-300/60 rounded-[1.5rem] md:rounded-[2.5rem] animate-rotate pointer-events-none"></div>
            
            {/* Bướm bay (Đẩy lùi ra một chút cho khỏi lẹm vào ảnh to) */}
            <div className="absolute -top-4 left-0 md:-top-4 md:-left-2 text-3xl md:text-5xl animate-float z-20">🦋</div>
            <div className="absolute top-10 -right-3 md:top-20 md:-right-8 text-3xl md:text-5xl animate-float z-20" style={{ animationDelay: '1.5s' }}>🦋</div>
            
            {/* ✨ Khung ảnh chính: Tăng từ md:w-64 lên md:w-72 */}
            <div className="w-48 h-48 md:w-72 md:h-72 border-[6px] md:border-8 border-amber-100/90 shadow-2xl overflow-hidden p-1 bg-white shrink-0 animate-avatar-neon rounded-[1.2rem] md:rounded-[2rem]">
              <img 
                src={memories[current].img} 
                className="w-full h-full object-cover rounded-[0.9rem] md:rounded-[1.5rem]" 
                alt="Kỷ niệm"
              />
            </div>
          </div>

          {memories[current].title && (
            <h3 className="font-bold text-base md:text-lg text-amber-900">{memories[current].title}</h3>
          )}
          {memories[current].desc && (
            <p className="text-xs md:text-sm text-gray-700 mb-2 mt-1">{memories[current].desc}</p>
          )}
        </div>

        <div className="mt-2 md:mt-4 flex gap-2 md:gap-3 w-full">
          {current > 0 && (
            <button 
              onClick={handlePrev} 
              className="flex-1 py-3 bg-white/80 text-amber-600 border-2 border-amber-200 hover:bg-amber-50 rounded-full font-bold shadow-sm transform transition-all active:scale-95 text-xs md:text-sm whitespace-nowrap"
            >
              ⬅️ Lùi lại
            </button>
          )}

          <button 
            onClick={handleNext} 
            className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full font-bold shadow-lg transform transition-all active:scale-95 animate-mobile-btn text-xs md:text-sm whitespace-nowrap"
          >
            {current < memories.length - 1 ? "Xem tiếp 💖 ➡️" : "Tiếp tục ✨"}
          </button>
        </div>

      </div>
    </section>
  );
}