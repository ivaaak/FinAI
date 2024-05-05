import { readFileSync } from 'fs';
import { Document } from 'pdfjs';
import axios from 'axios';
import TextSplitter from './textSplitter';

interface MessageArea {
    insert: (text: string) => void;
}

async function processPDFContentsAsChunks(pdfPath: string, messageArea: MessageArea): Promise<void> {
    const pdfData = readFileSync(pdfPath, 'utf-8');
    const pdfDocument = new Document();
    pdfDocument.addPagesOf(pdfData);
    let text = "";

    pdfDocument.on('page', (page: { text: string; }) => {
        text += page.text;
    });

    pdfDocument.on('pdf:complete', async () => {
        // Split into chunks
        const textSplitter = new TextSplitter(
            "\n",
            1000,
            200,
            (text: string) => text.length
        );
        const chunks = textSplitter.splitText(text);

        // Process each chunk with the LLM
        for (const chunk of chunks) {
            try {
                const response = await axios.post('http://localhost:3000/api/llm', { messages: chunk });
                console.log("Response from LLM:", response.data);
                // Assuming the LLM's response is processed and inserted into the messageArea
                messageArea.insert(response.data);
            } catch (error) {
                console.error("Error processing chunk with LLM:", error);
            }
        }
    });
}

// Example usage
const messageArea: MessageArea = {
    insert: (text: string) => console.log(text) // Placeholder for actual message insertion logic
};

processPDFContentsAsChunks('path/to/your/pdf.pdf', messageArea).then(() => console.log('PDF processing complete'));
