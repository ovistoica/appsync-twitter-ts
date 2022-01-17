import http, {AxiosRequestHeaders} from 'axios'

interface Config {
  url: string
  query: string
  variables: any
  auth?: string
  debug?: boolean
}

const fragments = {}
export const registerFragment = (name: string, fragment: unknown) =>
  (fragments[name] = fragment)

function* findUsedFragments(query: string, usedFragments = new Set()) {
  for (const name of Object.keys(fragments)) {
    if (query.includes(name) && !usedFragments.has(name)) {
      usedFragments.add(name)
      yield name

      const fragment = fragments[name]
      const nestedFragments = findUsedFragments(fragment, usedFragments)

      for (const nestedName of Array.from(nestedFragments)) {
        yield nestedName
      }
    }
  }
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
    query: ${query.slice(0, 1000)}
    
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

  const usedFragments = Array.from(findUsedFragments(query)).map(
    (name: string) => fragments[name],
  )

  const resp = await http({
    method: 'POST',
    url,
    headers,
    data: {
      query: [query, ...usedFragments].join('\n'),

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
