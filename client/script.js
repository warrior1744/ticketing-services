process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
 
const cookie =
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall6WkRNNE1XRTVNbUUyTjJZeU16a3pZemMwWVRObE9TSXNJbVZ0WVdsc0lqb2lhbTlvYmpKQVpYaGhiWEJzWlM1amIyMGlMQ0pwWVhRaU9qRTJOelE0TURVM09ETjkuMUJpLUdtMjVkTG1YLWVuNm5iQWs1MlJfdFd6NUZQc2ozTF9jNHVfRFM0ZyJ9';
 
const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );
 
  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );
 
  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );
 
  console.log('Request complete');
};
 
(async () => {
  for (let i = 0; i < 200; i++) {
    doRequest();
  }
})();