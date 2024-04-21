import { useState } from "react";
import { ChatMessages } from "./ChatMessages";
import { getSingleResponse } from "../services/chat";
import './ChatMessage.css'

export const ChatWindow = (): JSX.Element => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');


  const handleSubmit = () => {
    getSingleResponse(message).then(response => {
      setResponse(response);
    }).catch(error => {
      console.error("Error fetching response:", error);
    });
    setMessageHistory(prevMessages => [...prevMessages, message]);
    setMessageHistory(prevMessages => [...prevMessages, response]);
  };

  return (
    <div className="chatContainer">
      <div className="grow-1 mb-auto">
        <ChatMessages messages={messageHistory} currentMsg={message} />
      </div>
      <div className="mt-auto w-full">
        <div>
          {response && <div>Response: {response}</div>}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
