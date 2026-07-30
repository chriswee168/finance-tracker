/**
 * Function to query FastAPI backend with setter HTTP request.
 * 
 * @param {string} urlPath Full URL path.
 * @param {string} httpMethod HTTP method for fetch call.
 * @param {Object} body Object/data to send.
 * 
 * @returns Response object.
 */
export async function apiSendJSON(urlPath, httpMethod, body)
{
  const response = await fetch(urlPath, {
    method: httpMethod,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  return response
}