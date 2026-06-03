import { useState } from 'react';

export default function Page3({ playMusic, sendNotification }) {
  const [showModal, setShowModal] = useState(false);
  const [fallingElements, setFallingElements] = useState([]);
  const [noCount, setNoCount] = useState(0);
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
    playMusic();

    const chiTietBaoCao = noCount === 0 
      ? `Đồng ý ngay lập tức không suy nghĩ! (Nút: "${getYesButtonText()}")` 
      : `Đã chịu đồng ý sau ${noCount} lần bấm Không. (Nút: "${getYesButtonText()}")`;
    
    sendNotification("ĐỒNG Ý", chiTietBaoCao);
  };

  return (
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

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 border-4 border-amber-100 rounded-[2.5rem] p-8 md:p-12 text-center max-w-sm w-full shadow-2xl relative">
            <span className="text-6xl block mb-4 animate-bounce">🦋✨</span>
            <h3 className="text-2xl font-bold text-amber-600 mb-3 tracking-wider">Yêu Em Nhiều Nhất!</h3>      
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
    </section>
  );
}