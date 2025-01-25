import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'

import LoadingSpinner from './components/loader';
import GameRoom from './components/game-room';

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QueryClientProvider client={queryClient}>
        <GameRoom />
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
