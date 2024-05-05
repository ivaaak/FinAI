export default class TextSplitter {
    constructor(
        private separator: string,
        private chunkSize: number,
        private chunkOverlap: number,
        private lengthFunction: (text: string) => number) { }

    splitText(text: string): string[] {
        const chunks: string[] = [];
        let currentChunk = '';
        let currentLength = 0;

        for (const line of text.split(this.separator)) {
            if (currentLength + line.length > this.chunkSize) {
                chunks.push(currentChunk);
                currentChunk = line;
                currentLength = line.length;
            } else {
                currentChunk += this.separator + line;
                currentLength += this.separator.length + line.length;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks;
    }
}
