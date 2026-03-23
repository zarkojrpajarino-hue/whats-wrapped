'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { WrappedData } from '@/lib/types';

interface SavedAnalysis {
  id: string;
  title: string;
  created_at: string;
  data: WrappedData;
}

function serializeData(data: WrappedData): Record<string, unknown> {
  return JSON.parse(JSON.stringify(data));
}

function deserializeData(raw: Record<string, unknown>): WrappedData {
  const data = raw as unknown as WrappedData;
  // Restore Date objects from ISO strings
  data.firstMessages = data.firstMessages.map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp),
  }));
  data.longestStreak.start = new Date(data.longestStreak.start);
  data.longestStreak.end = new Date(data.longestStreak.end);
  data.peakDay.date = new Date(data.peakDay.date);
  data.eras = data.eras.map((era) => ({
    ...era,
    start: new Date(era.start),
    end: new Date(era.end),
  }));
  data.inflectionPoint.weekStart = new Date(data.inflectionPoint.weekStart);
  data.longestMessage.timestamp = new Date(data.longestMessage.timestamp);
  return data;
}

export function useAnalysisStorage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const saveAnalysis = async (data: WrappedData, title?: string): Promise<{ id: string | null; error: string | null }> => {
    if (!user) return { id: null, error: 'No autenticado' };

    setSaving(true);
    const analysisTitle = title || `${data.contactName} - ${data.totalMessages} mensajes`;

    const { data: row, error } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        title: analysisTitle,
        data: serializeData(data),
      })
      .select('id')
      .single();

    setSaving(false);

    if (error) return { id: null, error: error.message };
    return { id: row.id, error: null };
  };

  const listAnalyses = async (): Promise<{ analyses: SavedAnalysis[]; error: string | null }> => {
    if (!user) return { analyses: [], error: 'No autenticado' };

    setLoadingList(true);

    const { data, error } = await supabase
      .from('analyses')
      .select('id, title, created_at, data')
      .order('created_at', { ascending: false });

    setLoadingList(false);

    if (error) return { analyses: [], error: error.message };

    const analyses = (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      data: deserializeData(row.data as Record<string, unknown>),
    }));

    return { analyses, error: null };
  };

  const deleteAnalysis = async (id: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('analyses').delete().eq('id', id);
    return { error: error?.message ?? null };
  };

  return {
    saveAnalysis,
    listAnalyses,
    deleteAnalysis,
    saving,
    loadingList,
    isAuthenticated: !!user,
  };
}
