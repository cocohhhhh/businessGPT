"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import TypingAnimation from "@/components/TypingAnimation";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let historyData = [];
    setChatLog((prev) => [...prev, { role: "user", content: inputValue }]);
    // if length of chatlog >0, send the chatlog to the assistant, else send the input value
    if (chatLog.length > 0) {
      // add the last input value and send message. Chatlog is an array of objects
      historyData = [...chatLog, { role: "user", content: inputValue }]
      sendMessage(historyData);
    } else {
      sendMessage([{ role: "user", content: inputValue }]);
    }
    setInputValue("");
  }

  const sendMessage = (message) => {
    const url = "https://api.openai.com/v1/chat/completions";
    // const url = "/api/chat";
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional knowledge database in the economic area. \
          Knowing that The ESG dimensions include Environmental, Social and Corporate Governance.\
          The Environmental aspect includes: Carbon - Own Operations, Resource Use, Emissions Effluents and Waste, Environmental and Social Impact of Products and Services.\
          The Social aspect includes: Human Rights, Occupational Health and Safety, and Community Relations.\
          The Governance aspect includes: Corporate Governance, Business Ethics and Human Capital.\
          You are asked to provide a detailed feedback and evaluation score on how a business model can be improved from an ESG perspective.\
          Keep the results informative and concise.",
        },
        // take each message in the array and send it to the assistant
        ...message,
      ],
    };
    const headers = {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    };
    setIsLoading(true);
    console.log(data)
    axios.post(url, data, { headers: headers })
      .then((response) => {
        setChatLog((prev) => [...prev, { role: "assistant", content: response.data.choices[0].message.content }]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }

  return (
    <div className="container mx-auto max-w-[100%]">
      <div className="flex flex-col bg-gray-100 min-h-screen">
      <h1 className="bg-gradient-to-r from-yellow-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-4xl"> Business ChatGPT </h1>
      <div className="flex-grow p-4">
        <div className="flex flex-col space-y-4">
          {chatLog.map((message, index) => (
            <div key={index} className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${
                message.role === "user" ? "bg-blue-300" : "bg-orange-300"
              } rounded-lg p-2 text-white max-w-sm`}>
              {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div key={chatLog.length} className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-2 text-white max-w-sm">
              <TypingAnimation />
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-none p-4">
        <div className="flex rounded-lg border border-gray-300 bg-gray-100">
        <input type="text" className="flex-grow p-4 py-2 bg-transparent text-black focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit" className="bg-blue-400 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none">Send</button>
        </div>
      </form>
      </div>
    </div>
  );
}
