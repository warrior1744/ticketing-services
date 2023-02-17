import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import styles from "@/styles/Ticket.module.css";
import Image from "next/image";

const TicketShow = ({ ticket, currentUser }) => {
  const router = useRouter();
  const { doRequest, errors, success } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <Layout>
      <div className={styles.event}>
        <div>
          <h1>{ticket.title}</h1>
          <h4>Price: {ticket.price}</h4>
          {errors}
          {success && (
            <div className="alert alert-success">
              <p>Order {ticket.id} has been created</p>
            </div>
          )}
          <button onClick={() => doRequest()} className="btn btn-primary">
            Check Out
          </button>
        </div>
        <div className={styles.img}>
          <Image
            style={{ objectFit: "contain" }}
            alt={ticket.title}
            src={ticket.image || "/images/event-default.png"}
            width={600}
            height={600}
          />
        </div>
      </div>
    </Layout>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
