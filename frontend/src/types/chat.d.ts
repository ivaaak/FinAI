export interface Message {
    role?: string;
    message_id?: number;
    conversation_id?: number;
    messages: string;
    system: boolean;
    timestamp?: number;
  }
  
  export interface Conversation {
    conversation_id: number;
    title: string;
    timestamp: number;
    messages: Message[];
  };