import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { PropsWithChildren } from 'react';

const client = new QueryClient();
// Provider logic and explanation from: https://youtu.be/rIYzLhkG9TA?si=LHIlez4P8fuiPp-6&t=15510
export default function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}