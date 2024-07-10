import { API_URL } from '@/constants/contants'
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client'

const apiUrl = API_URL
console.log({ API_URL })
const getTokenForApi = (appTokenName: string) => {
  const token = localStorage.getItem(appTokenName)

  return token
}
const authMiddleware = new ApolloLink((operation, forward) => {
  const appTokenName = operation.getContext().appTokenName
  const token = getTokenForApi(appTokenName)

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  })

  return forward(operation)
})

const httpLink = new HttpLink({ uri: API_URL, credentials: 'same-origin' })

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
})

export default client
