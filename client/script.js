process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
 
const cookie =
  'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall6WkRNNE1XRTVNbUUyTjJZeU16a3pZemMwWVRObE9TSXNJbVZ0WVdsc0lqb2lhbTlvYmpKQVpYaGhiWEJzWlM1amIyMGlMQ0pwWVhRaU9qRTJOelE0TURVM09ETjkuMUJpLUdtMjVkTG1YLWVuNm5iQWs1MlJfdFd6NUZQc2ozTF9jNHVfRFM0ZyJ9';
 
const doRequest = async () => {
  await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'Throwback Thursdays with DJ Manny Duke', price: 800 , image: '/sample/event1.jpg'},
    {
      headers: { cookie },
    }
  );

  await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'Boom Dance Festival Experience', price: 650 , image: '/sample/event2.jpg'},
    {
      headers: { cookie },
    }
  );

  await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'Encore Night Boat Party', price: 550 , image: '/sample/event3.jpg'},
    {
      headers: { cookie },
    }
  );

  await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'Jam Concert Live', price: 900 , image: '/sample/event4.jpg'},
    {
      headers: { cookie },
    }
  );

  await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'UnMute Rock Festival', price: 870 , image: '/sample/event5.jpg'},
    {
      headers: { cookie },
    }
  );

  await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'Soul Kitchen Party', price: 785 , image: '/sample/event6.jpg'},
    {
      headers: { cookie },
    }
  );


 
  // await axios.put(
  //   `https://ticketing.dev/api/tickets/${data.id}`,
  //   { title: 'ticket', price: 10 },
  //   {
  //     headers: { cookie },
  //   }
  // );
 
  // axios.put(
  //   `https://ticketing.dev/api/tickets/${data.id}`,
  //   { title: 'ticket', price: 15 },
  //   {
  //     headers: { cookie },
  //   }
  // );
 
  console.log('Request complete');
};
 

doRequest();
