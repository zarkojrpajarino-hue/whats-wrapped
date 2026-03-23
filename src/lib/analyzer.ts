import { ParsedChat, WrappedData, Era, InflectionPoint } from './types';
import { STOP_WORDS } from './stopwords';

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function weekKey(d: Date): string {
  const start = new Date(d);
  start.setDate(start.getDate() - start.getDay());
  return dateKey(start);
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function calcLongestStreak(messages: { timestamp: Date }[]): { days: number; start: Date; end: Date } {
  const daysSet = new Set<string>();
  for (const m of messages) {
    daysSet.add(dateKey(m.timestamp));
  }

  const sortedDays = Array.from(daysSet).sort();
  let maxStreak = 1;
  let currentStreak = 1;
  let maxStart = 0;
  let currentStart = 0;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = daysBetween(prev, curr);

    if (diff === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        maxStart = currentStart;
      }
    } else {
      currentStreak = 1;
      currentStart = i;
    }
  }

  return {
    days: maxStreak,
    start: new Date(sortedDays[maxStart]),
    end: new Date(sortedDays[maxStart + maxStreak - 1]),
  };
}

function calcPeakDay(messages: { timestamp: Date }[]): { date: Date; count: number } {
  const counts = new Map<string, { date: Date; count: number }>();
  for (const m of messages) {
    const key = dateKey(m.timestamp);
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, { date: new Date(m.timestamp), count: 1 });
    }
  }

  let peak = { date: new Date(), count: 0 };
  for (const v of counts.values()) {
    if (v.count > peak.count) peak = v;
  }
  return peak;
}

function calcResponseTimes(
  messages: { timestamp: Date; sender: string }[],
  participants: string[]
): { name: string; avgMinutes: number }[] {
  const totals = new Map<string, { sum: number; count: number }>();
  for (const p of participants) {
    totals.set(p, { sum: 0, count: 0 });
  }

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];
    if (prev.sender !== curr.sender) {
      const diffMin = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 60000;
      // Cap at 24h to exclude "next day" responses
      if (diffMin > 0 && diffMin < 1440) {
        const entry = totals.get(curr.sender);
        if (entry) {
          entry.sum += diffMin;
          entry.count++;
        }
      }
    }
  }

  return participants.map((name) => {
    const entry = totals.get(name)!;
    return {
      name,
      avgMinutes: entry.count > 0 ? Math.round(entry.sum / entry.count) : 0,
    };
  });
}

function calcHourlyDistribution(messages: { timestamp: Date }[]): number[] {
  const hours = new Array(24).fill(0);
  for (const m of messages) {
    hours[m.timestamp.getHours()]++;
  }
  return hours;
}

function calcTopWords(
  messages: { sender: string; content: string; isMedia: boolean }[],
  participants: string[]
): { name: string; words: { word: string; count: number }[] }[] {
  const wordMaps = new Map<string, Map<string, number>>();
  for (const p of participants) {
    wordMaps.set(p, new Map());
  }

  for (const m of messages) {
    if (m.isMedia) continue;
    const map = wordMaps.get(m.sender);
    if (!map) continue;

    const words = m.content
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    for (const word of words) {
      map.set(word, (map.get(word) || 0) + 1);
    }
  }

  return participants.map((name) => {
    const map = wordMaps.get(name)!;
    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));
    return { name, words: sorted };
  });
}

function calcEras(messages: { timestamp: Date }[]): Era[] {
  if (messages.length < 20) {
    return [{
      start: messages[0]?.timestamp || new Date(),
      end: messages[messages.length - 1]?.timestamp || new Date(),
      label: 'La Historia Completa',
      description: 'Todo lo que habéis compartido.',
      messageCount: messages.length,
      avgPerDay: messages.length,
    }];
  }

  // Group messages by week
  const weekCounts = new Map<string, { start: Date; count: number }>();
  for (const m of messages) {
    const key = weekKey(m.timestamp);
    const existing = weekCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      weekCounts.set(key, { start: new Date(m.timestamp), count: 1 });
    }
  }

  const weeks = Array.from(weekCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  if (weeks.length < 3) {
    return [{
      start: messages[0].timestamp,
      end: messages[messages.length - 1].timestamp,
      label: 'La Historia Completa',
      description: 'Vuestra conversación al completo.',
      messageCount: messages.length,
      avgPerDay: messages.length / Math.max(1, daysBetween(messages[0].timestamp, messages[messages.length - 1].timestamp)),
    }];
  }

  // Detect significant shifts using rolling average
  const windowSize = Math.max(2, Math.floor(weeks.length / 10));
  const avgCounts: number[] = [];
  for (let i = 0; i < weeks.length; i++) {
    const start = Math.max(0, i - windowSize);
    const end = Math.min(weeks.length, i + windowSize + 1);
    const slice = weeks.slice(start, end);
    avgCounts.push(slice.reduce((s, w) => s + w.count, 0) / slice.length);
  }

  // Find split points where the rolling average changes significantly
  const splits: number[] = [0];
  for (let i = 1; i < avgCounts.length; i++) {
    const prev = avgCounts[i - 1];
    const curr = avgCounts[i];
    if (prev > 0 && Math.abs(curr - prev) / prev > 0.5) {
      // Only add if far enough from the last split
      if (i - splits[splits.length - 1] >= Math.max(3, Math.floor(weeks.length / 6))) {
        splits.push(i);
      }
    }
  }

  // Limit to 3-5 eras
  while (splits.length > 5) {
    // Remove the split with the smallest change
    let minIdx = 1;
    let minDiff = Infinity;
    for (let i = 1; i < splits.length; i++) {
      const diff = Math.abs(avgCounts[splits[i]] - avgCounts[splits[i] - 1]);
      if (diff < minDiff) {
        minDiff = diff;
        minIdx = i;
      }
    }
    splits.splice(minIdx, 1);
  }

  if (splits.length < 2) {
    // Force at least 3 eras by splitting equally
    const third = Math.floor(weeks.length / 3);
    splits.length = 0;
    splits.push(0, third, third * 2);
  }

  const eraLabels = [
    { label: 'El Comienzo', description: 'Prudentes, curiosos, midiendo cada palabra.' },
    { label: 'Conociéndoos', description: 'Las conversaciones se alargan, la confianza crece.' },
    { label: 'En Sintonía', description: 'Habláis de todo, a cualquier hora.' },
    { label: 'Conexión Total', description: 'Inseparables. El chat es vuestro espacio.' },
    { label: 'El Presente', description: 'Donde estáis ahora. Lo que viene es vuestro.' },
  ];

  const eras: Era[] = [];
  for (let i = 0; i < splits.length; i++) {
    const startIdx = splits[i];
    const endIdx = i + 1 < splits.length ? splits[i + 1] - 1 : weeks.length - 1;
    const eraWeeks = weeks.slice(startIdx, endIdx + 1);
    const msgCount = eraWeeks.reduce((s, w) => s + w.count, 0);
    const totalDays = Math.max(1, daysBetween(eraWeeks[0].start, eraWeeks[eraWeeks.length - 1].start));
    const labelInfo = eraLabels[Math.min(i, eraLabels.length - 1)];

    eras.push({
      start: eraWeeks[0].start,
      end: eraWeeks[eraWeeks.length - 1].start,
      label: labelInfo.label,
      description: labelInfo.description,
      messageCount: msgCount,
      avgPerDay: Math.round((msgCount / totalDays) * 10) / 10,
    });
  }

  return eras;
}

function calcInflectionPoint(messages: { timestamp: Date }[]): InflectionPoint {
  const weekCounts = new Map<string, { start: Date; count: number }>();
  for (const m of messages) {
    const key = weekKey(m.timestamp);
    const existing = weekCounts.get(key);
    if (existing) existing.count++;
    else weekCounts.set(key, { start: new Date(m.timestamp), count: 1 });
  }

  const weeks = Array.from(weekCounts.values()).sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  let maxJump = 0;
  let inflection: InflectionPoint = {
    weekStart: weeks[0]?.start || new Date(),
    count: weeks[0]?.count || 0,
    previousCount: 0,
    jump: 0,
  };

  for (let i = 1; i < weeks.length; i++) {
    const jump = weeks[i].count - weeks[i - 1].count;
    if (jump > maxJump) {
      maxJump = jump;
      inflection = {
        weekStart: weeks[i].start,
        count: weeks[i].count,
        previousCount: weeks[i - 1].count,
        jump,
      };
    }
  }

  return inflection;
}

export function analyzeChat(chat: ParsedChat): WrappedData {
  const { messages, participants } = chat;

  const totalDays = Math.max(1, daysBetween(chat.startDate, chat.endDate));

  // Message split
  const splitMap = new Map<string, number>();
  for (const p of participants) splitMap.set(p, 0);
  for (const m of messages) splitMap.set(m.sender, (splitMap.get(m.sender) || 0) + 1);

  const messageSplit = participants.map((name) => ({
    name,
    count: splitMap.get(name) || 0,
    percentage: Math.round(((splitMap.get(name) || 0) / messages.length) * 100),
  }));

  // Media count
  const mediaCount = { photos: 0, videos: 0, audios: 0, stickers: 0 };
  for (const m of messages) {
    if (m.mediaType === 'photo') mediaCount.photos++;
    else if (m.mediaType === 'video') mediaCount.videos++;
    else if (m.mediaType === 'audio') mediaCount.audios++;
    else if (m.mediaType === 'sticker') mediaCount.stickers++;
  }

  // Hourly distribution
  const hourly = calcHourlyDistribution(messages);
  const nightMessages = hourly.slice(21).reduce((a, b) => a + b, 0) +
    hourly.slice(0, 6).reduce((a, b) => a + b, 0);
  const nightPercentage = Math.round((nightMessages / messages.length) * 100);

  // Longest message (non-media)
  const textMessages = messages.filter((m) => !m.isMedia);
  const longestMessage = textMessages.reduce(
    (longest, m) => (m.content.length > longest.content.length ? m : longest),
    textMessages[0] || messages[0]
  );

  // Contact name: pick the participant who is NOT the one sending the most messages
  // (assumes the user is the one who talks the most). Fallback to first participant.
  const sorted = [...messageSplit].sort((a, b) => b.count - a.count);
  const contactName = sorted.length > 1 ? sorted[1].name : sorted[0]?.name || 'Chat';

  return {
    firstMessages: messages.slice(0, 4),
    totalMessages: messages.length,
    totalDays,
    longestStreak: calcLongestStreak(messages),
    peakDay: calcPeakDay(messages),
    responseTimes: calcResponseTimes(messages, participants),
    hourlyDistribution: hourly,
    nightPercentage,
    messageSplit,
    topWords: calcTopWords(messages, participants),
    mediaCount,
    eras: calcEras(messages),
    inflectionPoint: calcInflectionPoint(messages),
    longestMessage,
    participants,
    contactName,
  };
}
