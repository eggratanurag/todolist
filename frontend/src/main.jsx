import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import axios from 'axios'
import {
  QueryClient,
  QueryClientProvider,
   
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
axios.defaults.baseURL = 'https://todolist-brre.onrender.com';
// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// console.log(import.meta.env.VITE_BASE_URL)
// console.log(process.env.VITE_BASE_URL)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
     <QueryClientProvider client={queryClient}>
       <App />
       <ReactQueryDevtools />
     </QueryClientProvider>
  // </React.StrictMode>,
)
