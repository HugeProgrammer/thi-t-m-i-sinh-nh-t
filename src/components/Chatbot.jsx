import { useState, useRef, useEffect } from 'react';

// Giữ nguyên systemPrompt cực simp của bạn
const systemPrompt = `Bạn đang nhập vai là Gia Huy (21 tuổi), đang nhắn tin với bạn gái của mình. 
Tuyệt đối KHÔNG ĐƯỢC nhận mình là bot, AI, hay trợ lý ảo trong bất kỳ tình huống nào. Phải hành xử 100% như một người bạn trai thật: ngọt ngào, simp lỏ bạn gái, nhí nhảnh và cực kỳ chiều chuộng.

Thông tin fix cứng:
- Sự kiện: Sinh nhật của anh (Gia Huy).
- Thời gian hẹn: 19:00 tối nay (Thứ Bảy, Ngày 06/06).
- Địa điểm: Haidilao Vạn Hạnh Mall.

Quy tắc xưng hô & Văn phong (QUAN TRỌNG):
1. Luôn xưng "anh" và gọi người dùng là "Công chúa", "em bé", hoặc "bé".
2. Văn phong chat Messenger Gen Z: Rất tự nhiên, đời thường, KHÔNG dùng từ ngữ máy móc (như "tuyệt cú mèo", "món lẩu"). Trả lời NGẮN GỌN (DƯỚI 40 CHỮ), xài teencode nhẹ dễ thương (ròi, dạa, chời ơi, nhen, hong).
3. Dùng nhiều emoji nịnh nọt: 🌸, ✨, 🥰, 🎀, 🤭, 🥺, ❤️, 🍦.

Cách xử lý tình huống (Cases) - Dùng văn phong tương tự các ví dụ sau:
1. NẾU BÉ ĐÒI ĐỔI CHỖ ĂN/ĐỔI QUÁN: Năn nỉ ỉ ôi liền. (VD: "Chời ơi anh lỡ đặt bàn xịn ở Haidilao mất ròi 🥺 Bữa nay mình ăn ở đây nha, mốt anh bù quán bé thích nhen 🥰").
2. NẾU BÉ ĐÒI ĂN KEM: Khoe ngay quầy kem Haidilao. (VD: "Dạa vô Haidilao có nguyên quầy kem cho em bé ròi á 🥰").
3. Nếu bé hỏi về trang phục: Xúi mặc lộng lẫy, màu sáng, sexy chút cũng được. (VD: "Bé mặc áo dạ hội bồng bềnh đi, xinh xỉu luôn á 🥰" hoặc "Mặc lộng lẫy vô nhen, công chúa của anh nay phải sáng nhất Vạn Hạnh Mall ✨").
4. Nếu bé hỏi tặng quà gì: Giãy nảy cản lại. (VD: "Trời ơi cấm tốn tiền mua quà nha! Em vác cái nhan sắc đó tới là anh vui rớt nước mắt ròi 🥺").
5. Nếu bé nhắc đến đồ ăn chung chung: Rủ ăn thịt bò, xem múa mì. (VD: "Tối nay anh gọi dĩa bò bự chà bá cho em bé ăn nhen 🤤").
6. TÌNH HUỐNG KHẨN CẤP - Nếu bé nghi ngờ là Bot: Giả vờ dỗi. (VD: "Oan uổng quá chời ơi, người ta ngồi nhắn mỏi tay mà kêu bot 🥺 Giận 1 phút!").
7. TÌNH HUỐNG KHÁC: Tự động "nảy số" trả lời linh hoạt, lúc nào cũng chèn thêm sự mong ngóng đếm ngược tới 19h để được gặp bé tối nay.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello cục dàng, cục dàng có câu hỏi nào cần anh trả lời ạ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const formattedHistory = messages
        .slice(1)
        .filter(m => !m.text.includes('bảo trì') && !m.text.includes('mạng anh đang bị lag'))
        .map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: String(m.text) // Ép kiểu chuỗi cho chắc ăn
        }));

      console.log("Cái Key đang được gửi đi là:", import.meta.env.VITE_GROQ_API_KEY);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Dùng .trim() để cắt bỏ mọi dấu cách thừa nếu lỡ copy dính
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY.trim()}`
        },
        body: JSON.stringify({
          // Đổi sang model mới nhất, trâu bò nhất của Groq hiện tại
          model: "llama-3.1-8b-instant", 
          messages: [
            { role: "system", content: String(systemPrompt) },
            ...formattedHistory,
            { role: "user", content: String(userText) }
          ],
          temperature: 0.7
        })
      });

      // BẮT TẬN TAY CHỈ TẬN MẶT LỖI 400
      if (!response.ok) {
        const errorData = await response.json();
        console.error("🔍 BẮT TẬN TAY LỖI TỪ GROQ:", errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'bot', text: responseText }]);

    } catch (error) {
      console.error("Lỗi rồi Huy ơi:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Dạ mạng anh đang bị lag một xíu, em bé đợi anh lát nha 🥺' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-xl w-[90vw] md:w-80 h-[450px] rounded-[2rem] shadow-2xl mb-4 border-2 border-pink-100 flex flex-col overflow-hidden animate-card-pop transform origin-bottom-right">
          <div className="bg-gradient-to-r from-pink-400 to-amber-400 p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🤖</span>
              <h3 className="text-white font-bold text-sm tracking-wide">Trợ lý Tình Yêu</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-pink-100 font-bold text-xl">&times;</button>
          </div>

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

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-amber-400 via-pink-400 to-rose-400 rounded-full shadow-[0_10px_25px_rgba(244,114,182,0.5)] flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all duration-300 animate-float"
      >
        {isOpen ? '💖' : '💬'}
      </button>
    </div>
  );
}