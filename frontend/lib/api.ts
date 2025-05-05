import axios from "axios"

export const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
     headers: {
          "Content-Type": "application/json",
     },
})

// Add a request interceptor to handle file uploads
api.interceptors.request.use((config) => {
     if (config.data instanceof FormData) {
          config.headers = {
               ...config.headers,
               "Content-Type": "multipart/form-data",
          }
     }
     return config
})

// Add a response interceptor
api.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.response) {
               // The request was made and the server responded with a status code
               // that falls out of the range of 2xx
               console.error("API Error:", error.response.data)
          } else if (error.request) {
               // The request was made but no response was received
               console.error("API Error: No response received")
          } else {
               // Something happened in setting up the request that triggered an Error
               console.error("API Error:", error.message)
          }
          return Promise.reject(error)
     }
) 