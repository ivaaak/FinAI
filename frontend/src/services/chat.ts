import { Message } from "../types/chat";

export const getChatResponse = async (messages: Message[]): Promise<ReadableStreamDefaultReader<string> | undefined> => {
  console.log(messages);

  const res = await fetch("http://localhost:9000/api/llm", {
    method: "POST",
    body: JSON.stringify({
      messages,
    }),
    cache: "no-store",
  });

  return res.body?.pipeThrough(new TextDecoderStream()).getReader();
}

export const getSingleResponse = async (message: string) => {
  const res = await fetch("http://localhost:9000/api/llm", {
     method: "POST",
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       messages: message,
     }),
     cache: "no-store",
  });
  console.log("FE RESULT OF CALL", res);
 
  if (!res.ok) {
     throw new Error('Network response was not ok');
  }
 
  const data = await res.json();
  return data.response;
 }
 