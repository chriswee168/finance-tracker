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

/**
 * Function to query FastAPI backend with GET HTTP request.
 * 
 * @param {string} urlPath Full URL path.
 * 
 * @returns Response object.
 */
export async function apiGetJSON(urlPath)
{
  try
  {
      const response = await fetch(urlPath);
      if (!response.ok)
      {
          throw new Error(`${response.statusText}`);
      }

      const data = await response.json();
      return data;
  }
  catch (error)
  {
    console.log(error);
    return null;
  }
}