'use client';

import { useWrappedData } from '@/lib/context';
import { WrappedContainer } from '@/components/wrapped/WrappedContainer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WrappedPage() {
  const { data } = useWrappedData();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.push('/');
    }
  }, [data, router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return <WrappedContainer data={data} />;
}
