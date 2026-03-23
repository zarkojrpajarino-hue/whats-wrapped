import { ParsedChat, ParsedMessage } from './types';

// iOS: [12/03/2024, 14:23:45] John: Hello
const IOS_REGEX = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+(.+?):\s([\s\S]*)/;

// Android: 12/03/2024, 14:23 - John: Hello
const ANDROID_REGEX = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]\s*(.+?):\s([\s\S]*)/;

// System message patterns to skip
const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /los mensajes y las llamadas están cifrados/i,
  /creó el grupo/i,
  /created group/i,
  /cambió el asunto/i,
  /changed the subject/i,
  /añadió a/i,
  /added/i,
  /salió del grupo/i,
  /left/i,
  /eliminó a/i,
  /removed/i,
  /cambió la descripción/i,
  /changed the description/i,
  /cambió el icono/i,
  /changed this group's icon/i,
  /se unió con/i,
  /joined using/i,
  /fijó un mensaje/i,
  /pinned a message/i,
  /desactivó la desaparición/i,
  /turned off disappearing/i,
  /activó la desaparición/i,
  /turned on disappearing/i,
];

// Media detection patterns
const MEDIA_PATTERNS: { pattern: RegExp; type: ParsedMessage['mediaType'] }[] = [
  { pattern: /<media omitted>/i, type: 'photo' },
  { pattern: /imagen omitida/i, type: 'photo' },
  { pattern: /image omitted/i, type: 'photo' },
  { pattern: /foto omitida/i, type: 'photo' },
  { pattern: /audio omitido/i, type: 'audio' },
  { pattern: /audio omitted/i, type: 'audio' },
  { pattern: /vídeo omitido/i, type: 'video' },
  { pattern: /video omitido/i, type: 'video' },
  { pattern: /video omitted/i, type: 'video' },
  { pattern: /sticker omitido/i, type: 'sticker' },
  { pattern: /sticker omitted/i, type: 'sticker' },
  { pattern: /gif omitido/i, type: 'gif' },
  { pattern: /gif omitted/i, type: 'gif' },
  { pattern: /documento omitido/i, type: 'document' },
  { pattern: /document omitted/i, type: 'document' },
  { pattern: /\.jpg \(archivo adjunto\)/i, type: 'photo' },
  { pattern: /\.mp4 \(archivo adjunto\)/i, type: 'video' },
  { pattern: /\.opus \(archivo adjunto\)/i, type: 'audio' },
  { pattern: /\.webp \(archivo adjunto\)/i, type: 'sticker' },
];

function detectFormat(lines: string[]): 'ios' | 'android' {
  let iosCount = 0;
  let androidCount = 0;
  const sample = lines.slice(0, 30);

  for (const line of sample) {
    if (IOS_REGEX.test(line)) iosCount++;
    if (ANDROID_REGEX.test(line)) androidCount++;
  }

  return iosCount >= androidCount ? 'ios' : 'android';
}

function parseDate(dateStr: string, timeStr: string): Date {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date(0);

  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);

  // Handle 2-digit years
  if (year < 100) year += 2000;

  // Validate - if month > 12, assume MM/DD/YYYY format
  if (month > 12) {
    [day, month] = [month, day];
  }

  const timeParts = timeStr.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function detectMediaType(content: string): ParsedMessage['mediaType'] | undefined {
  for (const { pattern, type } of MEDIA_PATTERNS) {
    if (pattern.test(content)) return type;
  }
  return undefined;
}

function isSystemMessage(content: string): boolean {
  return SYSTEM_PATTERNS.some((p) => p.test(content));
}

export function parseWhatsApp(text: string): ParsedChat {
  const lines = text.split('\n');
  const format = detectFormat(lines);
  const regex = format === 'ios' ? IOS_REGEX : ANDROID_REGEX;

  const messages: ParsedMessage[] = [];
  const participantSet = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(regex);

    if (match) {
      const [, dateStr, timeStr, sender, content] = match;

      if (isSystemMessage(content)) continue;

      const mediaType = detectMediaType(content);
      const timestamp = parseDate(dateStr, timeStr);

      participantSet.add(sender);
      messages.push({
        timestamp,
        sender,
        content: content.trim(),
        isMedia: !!mediaType,
        mediaType,
      });
    } else if (messages.length > 0 && line.trim()) {
      // Multiline message - append to previous
      messages[messages.length - 1].content += '\n' + line;
    }
  }

  const participants = Array.from(participantSet);

  return {
    messages,
    participants,
    startDate: messages.length > 0 ? messages[0].timestamp : new Date(),
    endDate: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date(),
    format,
  };
}
