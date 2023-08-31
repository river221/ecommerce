type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const fetcher = async (url: string, method: Method, body?: { [key: string]: any }) => {
  try {
    if (!body) {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export default fetcher;
