import { useState } from 'react';
import confetti from 'canvas-confetti'; // ✨ Import thư viện pháo hoa

export default function Page3({ playMusic, sendNotification, noCount, setNoCount }) {
  const [showModal, setShowModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const rsvpPhrases = [
    "Em bé đồng ý đi sinh nhật anh nha! 🥰",
    "Ơi suy nghĩ lại đi bé 🥺",
    "Đi đi mà sinh nhật anh mà không có em thì sao gọi là sinh nhật được 😭",
    "Ai cho em ở từ chối :))))))"
  ];

  const getYesButtonText = () => {
    const texts = ["Em đồng ý! ❤️", "Em đi! 🥰", "Ròi tui đi", "Sao mà em từ chối tui được :)))))"];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  const getNoButtonText = () => {
    const texts = ["Không nha 😜", "Vẫn không đi 😤", "Nhất quyết không đi 🙄", ""];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  const handleNoClick = () => {
    if (noCount === 2) {
      sendNotification("TỪ CHỐI", "Công chúa đã bấm Không đủ 3 lần và hết đường thoát 😭");
    }
    setNoCount(prev => prev + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  // ✨ HÀM BẮN PHÁO HOA LIÊN TỤC TRONG 3 GIÂY
  const fireFireworks = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // Bắn từ bên trái
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff007f', '#ffb6c1', '#ffd700'] // Hồng đậm, hồng nhạt, vàng gold
      });
      // Bắn từ bên phải
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff007f', '#ffb6c1', '#ffd700']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleYesClick = () => {
    // Kích hoạt pháo hoa
    fireFireworks();
    
    // Hiện Modal & Phát nhạc
    setShowModal(true);
    playMusic();

    // Gửi báo cáo
    const chiTietBaoCao = noCount === 0 
      ? `Đồng ý ngay lập tức không suy nghĩ! (Nút: "${getYesButtonText()}")` 
      : `Đã chịu đồng ý sau ${noCount} lần bấm Không. (Nút: "${getYesButtonText()}")`;
    
    sendNotification("ĐỒNG Ý", chiTietBaoCao);
  };

  return (
    <section id="page3" className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative p-4 md:p-6 py-16 z-10">
      
      {/* Main card */}
      <div className={`text-center max-w-xl flex flex-col items-center bg-white/65 backdrop-blur-md p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 shadow-2xl gold-border-glow mx-4 transition-all duration-500 animate-card-pop w-[90%] sm:w-auto ${isShaking ? 'animate-shake' : ''}`}>
        <div className="text-5xl md:text-6xl mb-4 md:mb-6 animate-float">👑</div>
        
        <h2 className="text-lg md:text-2xl font-bold text-amber-950 mb-8 md:mb-12 leading-relaxed tracking-wide min-h-[80px] flex items-center justify-center transition-all duration-300">
          {rsvpPhrases[Math.min(noCount, rsvpPhrases.length - 1)]}
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full min-h-[100px] relative">
          <button 
            onClick={handleYesClick}
            style={{ transform: `scale(${1 + noCount * 0.1})` }}
            className={`px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-white font-bold rounded-full shadow-xl active:scale-95 transition-all duration-300 cursor-pointer w-full sm:w-auto text-sm md:text-base whitespace-nowrap z-10 animate-mobile-btn ${noCount > 0 ? 'animate-pulse-glow' : ''}`}
          >
            {getYesButtonText()}
          </button>

          {noCount < 3 && (
            <button 
              onClick={handleNoClick}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-sm md:text-base rounded-full shadow-md transition-all duration-200 cursor-pointer w-full sm:w-auto whitespace-nowrap active:scale-90"
            >
              {getNoButtonText()}
            </button>
          )}
        </div>
      </div>

      {/* ✨ Success Modal Nâng Cấp */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-500">
          
          {/* Hộp quà Modal phát sáng rực rỡ */}
          <div className="bg-white/95 border-4 border-amber-300 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-center max-w-sm w-full shadow-[0_0_80px_rgba(251,191,36,0.5)] relative animate-card-pop overflow-hidden">
            
            {/* Lớp viền Gradient lấp lánh chạy bên trong */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-pink-100/40 pointer-events-none"></div>

            <span className="text-6xl md:text-7xl block mb-6 animate-balloon">🥰🦋</span>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500 mb-4 tracking-wider">
              Yêu Em Nhiều Nhất!
            </h3>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 font-semibold relative z-10">
              Anh cảm ơn công chúa đã đồng ý đi sinh nhật anh nha. Chuẩn bị thật lộng lẫy nha cục dàng! ✨
            </p>
            
            <button 
              onClick={() => setShowModal(false)}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(244,114,182,0.6)] transition-all text-sm md:text-base cursor-pointer animate-pulse-glow animate-mobile-btn w-full relative z-10"
            >
              Hẹn gặp em bé vào thứ Bảy 🙈
            </button>
          </div>
        </div>
      )}
    </section>
  );
}