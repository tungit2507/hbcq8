import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    try {
    const response = await axios.post(
      "http://localhost:1234/v1/chat/completions",
      {
        model: "deepseek-r1-distill-qwen-7bq8_0", // Tên model bạn đang chạy
        messages: [{ role: "user", content: "Xin Chào AI" }],
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  }
  };

  return (
    <div>
      <h2>Chat với AI</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập câu hỏi..."
      />
      <button onClick={sendMessage}>Gửi</button>
      <p><strong>Phản hồi:</strong> {response}</p>
    </div>
  );
};

export default ChatBot;
