import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BsFillSendFill } from 'react-icons/bs';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hi! I’m your Kondaji shopping assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const faqOptions = [
    '🛍️ Product Details',
    '📦 What is Order Status?',
    '🔁 How to Return a Product?',
    '📋 Available Products',
    '🧾 View My Orders',
    '📞 Need Help or Support?',
  ];

  const sendMessage = (msg = input.trim()) => {
    if (!msg) return;

    const newUserMessage = { sender: 'user', text: msg };
    setMessages((prev) => [...prev, newUserMessage]);

    const reply = getBotReply(msg);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);

    setInput('');
  };

  const getBotReply = (msg) => {
    const text = msg.toLowerCase();

    if (text.includes('product details')) {
      return '🔍 You can find product details by going to the product listing or clicking on any product card. For order-specific products, visit the "My Orders" page.';
    }
    if (text.includes('order status')) {
      return '📦 Your order status includes "Processing", "Approved", "Shipped", or "Delivered". Go to "Track Order" in your account to view real-time updates.';
    }
    if (text.includes('return')) {
      return '🔁 To return an item, go to "My Orders" and click "Return" next to the relevant order (only eligible products can be returned).';
    }
    if (text.includes('products') || text.includes('available')) {
      return '🛍️ You can browse all available products in the “Products” section. Categories include Snacks, Dry Fruits, Namkeen, and more.';
    }
    if (text.includes('my orders') || text.includes('order history')) {
      return '📋 Head to "My Orders" in your profile menu to view your full order history with status and tracking options.';
    }
    if (text.includes('support') || text.includes('help') || text.includes('contact')) {
      return '📞 For help, visit our Support page or email us at support@kondaji.com. We typically reply within 24 hours.';
    }
    if (text.includes('hi') || text.includes('hello')) {
      return '👋 Hello again! I can help you with orders, returns, products, and more!';
    }

    return "🤖 I didn't catch that. Try asking about: product details, order status, return process, or support.";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-red-500 text-white px-6 py-4 text-lg font-semibold">
          Kondaji ChatBot
        </div>

        {/* FAQ Suggestions */}
        <div className="px-4 py-3 bg-gray-100 border-b space-y-2">
          <p className="text-sm text-gray-700 font-semibold">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {faqOptions.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(faq)}
                className="bg-red-100 hover:bg-red-200 text-sm text-red-800 px-3 py-1 rounded-full transition"
              >
                {faq}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[400px] overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 text-sm rounded-lg ${
                msg.sender === 'bot'
                  ? 'bg-gray-200 text-left'
                  : 'bg-red-100 text-right ml-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2 border-t p-4 bg-white">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => sendMessage()}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            <BsFillSendFill />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
