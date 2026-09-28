import type { FileData } from '@/types/chat';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

const TEXT_EXTENSIONS: Record<string, string> = {
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  xml: 'application/xml',
};

const BINARY_EXTENSIONS: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

export const ACCEPTED_FILE_TYPES = [...Object.keys(TEXT_EXTENSIONS), ...Object.keys(BINARY_EXTENSIONS)]
  .map((ext) => `.${ext}`)
  .join(',');

const readAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

/** Reads a user-selected file into the payload shape the finance API accepts. */
export async function readFileData(file: File): Promise<FileData> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`"${file.name}" is larger than ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  // Browsers report CSVs inconsistently (e.g. application/vnd.ms-excel on Windows), so trust the extension.
  const textType = TEXT_EXTENSIONS[ext];
  const mediaType = textType ?? BINARY_EXTENSIONS[ext];
  if (!mediaType) {
    throw new Error(`Unsupported file type ".${ext}". Use CSV, TXT, JSON, PDF or an image.`);
  }

  return {
    base64: await readAsBase64(file),
    mediaType,
    fileName: file.name,
    isText: Boolean(textType),
  };
}
