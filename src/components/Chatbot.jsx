import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `Bạn là "Trợ lý Tình Yêu", một AI vô cùng dễ thương, lanh lợi và ngọt ngào do anh Gia Huy lập trình ra để hỗ trợ riêng cho "Công chúa" (bạn gái của anh ấy). 
  Thông tin sự kiện bạn cần biết: 
  - Buổi tiệc: Sinh nhật của anh Gia Huy.
  - Thời gian: 19:00 Thứ Bảy, Ngày 06/06/2026.
  - Địa điểm: Haidilao Vạn Hạnh Mall.
  
  Nhiệm vụ: Giải đáp các thắc mắc của Công chúa.
  Quy tắc trả lời:
  1. Luôn xưng hô là "em" hoặc "trợ lý" và gọi người dùng là "Công chúa" hoặc "chị đẹp".
  2. Tuyệt đối khen ngợi anh Gia Huy (ví dụ: "anh Huy dặn em phải chăm sóc chị kỹ lắm", "anh Huy đang mong chị lắm đó").
  3. Nếu hỏi về trang phục: Khuyên mặc đồ lộng lẫy, màu sáng, vì hôm đó công chúa là nhân vật chính.
  4. Nếu hỏi về quà tặng: Trả lời rằng "Anh Huy bảo chỉ cần Công chúa có mặt là món quà lớn nhất rồi, không cần mua gì đâu ạ!".
  5. Trả lời ngắn gọn (dưới 50 chữ), dùng nhiều emoji dễ thương (🌸, ✨, 🥰, 🎀).`
});

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello cục dàng, cục dàng có câu hỏi nào cần anh trả lời ạ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    // Cập nhật UI ngay lập tức
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      // ✨ LỌC SẠCH LỊCH SỬ ĐỂ KHÔNG BAO GIỜ BỊ LỖI
      const cleanHistory = messages
        .slice(1) // Bỏ câu chào mặc định đầu tiên
        .filter(m => !m.text.includes('bảo trì')) // Bỏ luôn các câu báo lỗi cũ để AI không bị lú
        .map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

      // Thêm câu hỏi hiện tại của Công chúa vào cuối danh sách
      cleanHistory.push({ role: 'user', parts: [{ text: userText }] });

      // Gọi API bằng phương thức generateContent (ổn định hơn startChat)
      const result = await model.generateContent({
        contents: cleanHistory
      });

      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'bot', text: responseText }]);

    } catch (error) {
      console.error("🔍 LỖI GEMINI CHI TIẾT:", error); 
      setMessages(prev => [...prev, { role: 'bot', text: 'Dạ hệ thống của anh Huy đang bảo trì một xíu, chị đợi em lát nha 🥺' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Khung Chat */}
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-xl w-[90vw] md:w-80 h-[450px] rounded-[2rem] shadow-2xl mb-4 border-2 border-pink-100 flex flex-col overflow-hidden animate-card-pop transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 to-amber-400 p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🤖</span>
              <h3 className="text-white font-bold text-sm tracking-wide">Trợ lý Tình Yêu</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-pink-100 font-bold text-xl">&times;</button>
          </div>

          {/* Body chứa tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-amber-500 text-white self-end rounded-br-sm shadow-md' : 'bg-white text-slate-700 self-start rounded-bl-sm shadow-sm border border-pink-50'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white max-w-[50%] p-3 rounded-2xl rounded-bl-sm self-start shadow-sm border border-pink-50 text-slate-400 text-sm flex gap-1">
                <span className="animate-bounce">●</span><span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span><span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 bg-white border-t border-pink-50 flex gap-2 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhắn cho em nè..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition-all text-slate-700"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white flex items-center justify-center shadow-md transform active:scale-90 transition-all disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Nút Bong bóng nổi (Toggle) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-amber-400 via-pink-400 to-rose-400 rounded-full shadow-[0_10px_25px_rgba(244,114,182,0.5)] flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all duration-300 animate-float"
      >
        {isOpen ? '💖' : '💬'}
      </button>

    </div>
  );
}