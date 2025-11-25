import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './wagmi'
import './index.css'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={client}>
        <App />
    </QueryClientProvider>
  </WagmiProvider>
)
