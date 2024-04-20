import { Message } from "../types/chat";

interface ChatMessagesProps {
 messages: Message[];
 currentMsg: string;
}

export const ChatMessages = ({
 messages,
 currentMsg,
}: ChatMessagesProps): JSX.Element => {
 return (
    <>
      {messages?.map((message, index) => (
        <ChatMessage message={message} key={index} />
      ))}
      {currentMsg && (
        <ChatMessage message={{ content: currentMsg, system: true }} />
      )}
    </>
 );
};

const ChatMessage = ({ message }: { message: Message }): JSX.Element => {
 return (
    <div
      className={"mb-4 mt-2 rounded-md p-4"}
    >
      <div className="text-xs uppercase font-semibold pb-3">
        {message.system 
          ? <>
              <img 
                className="rounded-full inline mr-2" 
                src="/llama.jpg" 
                alt="llama profile image" 
                height={20} 
                width={20} 
              />
              LLAMA 2
            </> 
          : <>
              YOU
            </>}
      </div>
      {message.content}
    </div>
 );
};
