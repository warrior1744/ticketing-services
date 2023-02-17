import Link from "next/link";
import Layout from "@/components/layout";
import Image from "next/image";
import styles from "@/styles/Order.module.css";

const OrderIndex = ({ orders }) => {
  console.log("orders", orders);
  return (
    <div>
      <Layout>
        <Link href="/">Go back</Link>
        <h1>My Orders</h1>
        {orders.length === 0 && <h3>You have no orders</h3>}
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <div className={styles.order}>
                <div className={styles.img}>
                  <Image
                    style={{ objectFit: "contain" }}
                    alt={order.ticket.title}
                    src={order.ticket.image || "/images/event-default.png"}
                    width={120}
                    height={80}
                  />
                </div>
                <div className={styles.info}>
                  <p>{order.ticket.title}</p>
                  <p>$ {order.ticket.price} TWD</p>
                </div>
                <div className={styles.stats}>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            </li>
          ))}
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
