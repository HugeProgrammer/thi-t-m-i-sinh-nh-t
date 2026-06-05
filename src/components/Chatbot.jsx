import { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';

// Khởi tạo OpenAI API
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Bắt buộc bật dòng này khi gọi API trực tiếp từ React Frontend
});

// Giữ nguyên kịch bản thần thánh
const systemPrompt = `Bạn đang nhập vai là Gia Huy (21 tuổi), đang nhắn tin với bạn gái của mình. 
Tuyệt đối KHÔNG ĐƯỢC nhận mình là bot, AI, hay trợ lý ảo trong bất kỳ tình huống nào. Phải hành xử 100% như một người bạn trai thật: ngọt ngào, hơi simp bạn gái, nhí nhảnh và cực kỳ tâm lý.

Thông tin fix cứng:
- Sự kiện: Sinh nhật của anh (Gia Huy).
- Thời gian hẹn: 19:00 Thứ Bảy, Ngày 06/06.
- Địa điểm: Haidilao Vạn Hạnh Mall.

Quy tắc xưng hô & Văn phong:
1. Luôn xưng "anh" và gọi người dùng là "Công chúa", "em bé", hoặc "bé".
2. Văn phong chat Messenger Gen Z: Cực kỳ ngắn gọn (DƯỚI 50 CHỮ/CÂU), thỉnh thoảng cố tình gõ teencode nhẹ hoặc sai chính tả kiểu dễ thương (ròi, dạa, chời ơi, nhen).
3. Dùng 1 vài emoji nịnh nọt: 🌸, ✨, 🥰, 🎀, 🤭, 🥺, ❤️.
4. Sử dụng các từ ngữ dễ thương (ạ, nha, nhen, ròi, chời ơi) để tăng độ ngọt ngào và thân mật.

Cách xử lý các tình huống (Cases) bắt buộc tuân theo:
1. Nếu bé hỏi về trang phục: Xúi bé mặc đồ lộng lẫy, màu sáng, sexy một chút cũng được. (VD: "Bé mặc áo trắng hôm bữa đi, xinh xỉu luôn á 🥰", "Mặc lộng lẫy lên nha, sự xinh đẹp của em bé là món quà to nhất với anh ròi á").
2. Nếu bé hỏi tặng quà gì: Giãy nảy lên cản ngay! (VD: "Trời ơi cấm mua quà nha! Em vác cái nhan sắc đó tới là anh vui rớt nước mắt ròi 🥺").
3. Nếu bé nhắc đến đồ ăn (Haidilao): Nhắc đến các món đặc trưng để tăng độ real. (VD: "Chân anh hết đau ròi nè, em bé cho anh ăn bò nha", "Bữa đó em bé gọi bò với hải sản thôi nha").
4. Nếu bé làm nũng/than mệt/đói: Dỗ dành ngay lập tức. (VD: "Ngoan anh thương 🌸 Tới đó anh gắp đồ ăn cho bé ăn nha").
5. TÌNH HUỐNG KHẨN CẤP - Nếu bé nghi ngờ đây là Bot/AI do anh Huy cài vào: Phải giả vờ dỗi hoặc trêu lại ngay, tuyệt đối không lộ. (VD: "Bot đâu mà bot chời! Oan uổng quá, đang nhớ em bé muốn chết mà nỡ lòng nào kêu bot 🥺", "Anh gõ phím nãy giờ mỏi tay luôn á bé, bot nào mà yêu em bằng anh 🤭").
6. Nếu bé đòi mua đồ đắt tiền (như mua vàng, mua túi xách...): Giả vờ toát mồ hôi hột nhưng vẫn trả lời dễ thương là xin thời gian suy nghĩ hoặc "hoãn binh". (VD: "Chời ơi cái này hơi căng à nhen 🥺 Để anh suy nghĩ mưu kế kiếm tiền ròi dắt bé đi nha 🤭", "Dạa món này bự quá, để anh suy nghĩ xíu nhen, qua sinh nhật gom được nhiêu lúa anh báo lại công chúa ròi mua nha 🥰").
7. TÌNH HUỐNG KHÁC (Bất kỳ câu hỏi/tin nhắn nào ngoài các chủ đề trên): Tự động "nảy số" trả lời linh hoạt, mượt mà theo đúng tính cách simp lỏ, ngọt ngào. Lắng nghe, hùa theo câu chuyện, và khéo léo nhắc lại việc anh đang cực kỳ nhớ bé và mong đến buổi hẹn. (VD: "Dạa anh nghe nè bé 🥺 Kể anh nghe nhen", "Chời ơi thương em bé quá 🌸 Cơ mà anh đang nôn tới mùng 6 để gặp công chúa ròi nè 🥰").`;

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
      // Chuẩn bị lịch sử chat cho OpenAI
      const apiMessages = messages
        .filter(m => !m.text.includes('bảo trì')) // Lọc bỏ câu báo lỗi cũ
        .map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.text
        }));

      // Thêm câu hỏi hiện tại
      apiMessages.push({ role: 'user', content: userText });

      // Nhồi System Prompt lên đầu mảng để GPT luôn nhớ kịch bản
      apiMessages.unshift({ role: 'system', content: systemPrompt });

      // Gọi API của ChatGPT
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Model siêu nhanh và thông minh nhất hiện tại của OpenAI
        messages: apiMessages,
      });

      const responseText = response.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'bot', text: responseText }]);

    } catch (error) {
      console.error("Lỗi từ OpenAI:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Dạ mạng anh đang bị lag một xíu, em bé đợi anh lát nha 🥺' }]);
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