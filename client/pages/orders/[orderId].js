import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useRouter } from "next/router";
import Layout from "@/components/layout";

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors, success } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    //cleanup
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    setTimeout(() => {
      router.push("/orders");
    }, 5000);
    return (
      <div>
        <h1>Order Expired</h1>
        <p>Redirecting to orders page...</p>
      </div>
    );
  }

  return (
    <div>
      <Layout>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51MWhDuDNyzb8MqEPfVgTIrT6kv0Thj5phHNUXw93vEAJ6bD4dOZFqiRk2a9igmM4HChqVlQXbIEWhxv6xq9mcQZN00ayF1NqvM"
          amount={order.ticket.price}
          currency="TWD"
          description={order.ticket.title}
          label="Paid with Stripe"
          name="Jim1984 Tickets"
          email={currentUser.email}
        />
        {errors}
        {success && (
          <div className="alert alert-success">
            <h4>Success</h4>
            <p>Order {order.id} has been paid</p>
          </div>
        )}
      </Layout>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
