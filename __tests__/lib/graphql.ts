import http, {AxiosRequestHeaders} from 'axios'

interface Config {
  url: string
  query: string
  variables: any
  auth?: string
  debug?: boolean
}

const throwOnErrors = ({
  query,
  variables,
  errors,
}: {
  query: string
  variables: any
  errors: any
}) => {
  if (errors) {
    const errorMessage = `
    query: ${query.slice(0, 100)}
    
    variables: ${JSON.stringify(variables, null, 2)}
    
    error: ${JSON.stringify(errors, null, 2)}`
    throw new Error(errorMessage)
  }
}

export default async function Graphql<TRet = any>({
  auth,
  url,
  query,
  variables,
  debug = false,
}: Config): Promise<TRet> {
  const headers: AxiosRequestHeaders = {}
  if (auth) {
    headers.Authorization = auth
  }

  const resp = await http({
    method: 'POST',
    url,
    headers,
    data: {
      query,
      variables: JSON.stringify(variables),
    },
  })
  const {data, errors} = resp.data
  if (debug) {
    console.log('REQUEST FINISHED', JSON.stringify(resp.data))
  }
  throwOnErrors({query, variables, errors})
  return data
}
