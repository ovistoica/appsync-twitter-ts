import http, {AxiosRequestHeaders} from 'axios'
import get from 'lodash/get'

interface Config {
  url: string
  query: string
  variables: any
  auth?: string
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
}: Config): Promise<TRet> {
  const headers: AxiosRequestHeaders = {}
  if (auth) {
    headers.Authorization = auth
  }

  try {
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
    throwOnErrors({query, variables, errors})
    return data
  } catch (err) {
    const errors = get(err, 'response.data.errors')
    throwOnErrors({query, variables, errors})
  }
}
