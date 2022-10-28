import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {ApolloClient, InMemoryCache, HttpLink, ApolloProvider} from "@apollo/client"
import './index.css'

const getAuth = () => {
  const token = localStorage.getItem("phonenumbers-user-token")
  return token ? `bearer ${token}` : null
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/",
    headers: {
      authorization: getAuth()
    }
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
