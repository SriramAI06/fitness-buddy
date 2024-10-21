export const exerciseOptions = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'fc5d6442a4msh6ef6fbe36d721c2p180351jsnc507b594aede',
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    },
  };

  export const youtubeOptions = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'fc5d6442a4msh6ef6fbe36d721c2p180351jsnc507b594aede',
      'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com'
    },
  };
  
export const fetchData = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();

    return data;
}