export default function Page1({ onNext }) {
  return (
    <section id="page1" className="h-screen w-full flex flex-col items-center justify-center relative p-6 z-10">
      <div className="text-center max-w-xl flex flex-col items-center bg-white/65 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/70 shadow-2xl gold-border-glow transform transition-all duration-500 animate-card-pop">
        <p className="text-xs tracking-[0.35em] text-amber-700 font-bold uppercase mb-4 drop-shadow-sm animate-pulse">CELEBRATING WITH MY PRINCESS</p>
        <h1 className="text-3xl md:text-5xl font-serif italic font-normal mb-8 leading-tight shimmer-text">
          Princess is turning beautiful 💙
        </h1>
        
        <div className="my-2 relative flex justify-center items-center shrink-0 animate-float">
          <div className="absolute w-72 h-72 border-2 border-dashed border-amber-300/40 rounded-full animate-rotate pointer-events-none"></div>
          <div className="absolute -top-6 left-2 text-4xl animate-float z-20">🦋</div>
          <div className="absolute top-16 -right-6 text-4xl animate-float z-20" style={{ animationDelay: '1.5s' }}>🦋</div>
          
          <div className="w-60 h-60 md:w-68 md:h-68 rounded-full border-8 border-amber-100/90 shadow-2xl overflow-hidden p-1 bg-white shrink-0 transition-transform duration-300 animate-avatar-neon">
            <img 
              src="./avt4.jpg" 
              alt="Princess" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        
        <button 
          onClick={onNext}
          className="mt-8 px-10 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-bold text-lg rounded-full shadow-lg shadow-amber-600/40 transform transition-all duration-300 cursor-pointer animate-mobile-btn animate-pulse-glow"
        >
          Em bé bấm vào đây để xem thiệp mời nha ✨
        </button>
      </div>
    </section>
  );
}