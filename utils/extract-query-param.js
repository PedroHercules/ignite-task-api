export function extractQueryParam(query) {
  const queryArray = query.substr(1).split('&')
  const extractedQuery = queryArray.reduce((queryParams, param) => {
    const [key, value] = param.split('=')
    queryParams[key] = value
    
    return queryParams
  })
}