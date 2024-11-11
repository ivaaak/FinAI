import { Message } from "../types/message";

// src/utils/validation.ts
export const isValidBase64 = (str: string): boolean => {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
};

export const validateRequest = (messages?: Message[], model?: string): void => {
    if (!messages || !Array.isArray(messages)) {
        throw new Error("Messages array is required");
    }

    if (!model) {
        throw new Error("Model selection is required");
    }
};