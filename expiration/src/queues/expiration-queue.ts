import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publisher/expiration-complete-publisher";
import { natsWrapper } from "../nats/nats-wrapper";

interface Payload {
  orderId: string;
}

//code to enqueue a job
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

//code to process a job
expirationQueue.process(async (job) => {
  console.log(
    "Publishing an expiration:complete event for orderId",
    job.data.orderId
  );

  //when the delay (if exist) is reached, process (publish) the job in the queue with an orderId.
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
});

export { expirationQueue }
