import './ChatMessage.css'

interface ChatMessagesProps {
 messages: string[];
 currentMsg: string;
}

export const ChatMessages = ({
  messages,
 }: ChatMessagesProps): JSX.Element => {
  return (
     <div className="chat-messages-container">
       {messages?.map((message, index) => (
         <ChatMessage message={message} key={index} />
       ))}
     </div>
  );
 };
 
 const ChatMessage = ({ message }: { message: string }): JSX.Element => {
  return (
     <div className="chat-message">
       {/* <div className="sender-name">
         {message 
           ? <>
               <img 
                 className="profile-image rounded-full inline mr-2" 
                 src="/llama.jpg" 
                 alt="llama profile image" 
               />
               LLAMA 2
             </> 
           : <>
               YOU
             </>}
       </div> */}
       <div className="message-text">{message}</div>
     </div>
  );
 };
 