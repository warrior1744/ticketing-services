import Link from "next/link";
import Layout from "@/components/layout";

const OrderIndex = ({ orders }) => {
  return (
    <div>
      <Layout>
        <ul>
          {orders.map((order) => {
            return (
              <li key={order.id}>
                {order.ticket.title} - {order.status}
              </li>
            );
          })}
        </ul>
      </Layout>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
