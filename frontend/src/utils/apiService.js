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
  try
  {
      const response = await fetch(urlPath, {
        method: httpMethod,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
    
      if (!response.ok)
      {
          throw new Error(`${response.statusText}`);
      }

      return response;
  }
  catch (error)
  {
    console.log(error);
    return null;
  }
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
    }
  catch (error)
  {
    console.log(error);
    return null;
  }
}