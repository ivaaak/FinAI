// src/types/message.ts
export interface Message {
    role: 'user' | 'assistant';
    content: string | MessageContent[];
}

export interface MessageContent {
    type: 'text' | 'image';
    text?: string;
    source?: {
        type: 'base64';
        media_type: string;
        data: string;
    };
}

export interface FileData {
    base64: string;
    mediaType: string;
    isText: boolean;
    fileName?: string;
}