import React from "react";
import Layout from "@/components/layout";
import styles from "@/styles/Order.module.css";
import Link from "next/link";
import Image from "next/image";

const MyTickets = ({ currentUser, myTickets }) => {
  console.log("My ticket", myTickets);
  return (
    <div>
      <Layout>
        <Link href="/">Go back</Link>
        <h1>My Tickets for sell</h1>
        {myTickets.length === 0 && <h3>You have no tickets for sell</h3>}

        <ul>
          {myTickets.map((ticket) => (
            <li key={ticket.id}>
              <div className={styles.order}>
                <div className={styles.img}>
                  <Image
                    style={{ objectFit: "contain" }}
                    alt={ticket.title}
                    src={ticket.image || "/images/event-default.png"}
                    width={120}
                    height={80}
                  />
                </div>
                <div className={styles.info}>
                  <h3>{ticket.title}</h3>
                  <p>$ {ticket.price} TWD</p>
                </div>
                {ticket.orderId ? (
                  <div className={styles.link}>
                    <Image
                      style={{ objectFit: "contain" }}
                      alt={ticket.title}
                      src={"/images/sold.png"}
                      width={120}
                      height={80}
                    />
                  </div>
                ) : (
                  <div className={styles.link}>
                    <Link
                      legacyBehavior
                      href="/tickets/edit/[ticketId]"
                      as={`/tickets/edit/${ticket.id}`}
                    >
                      <a className="btn btn-secondary">Edit</a>
                    </Link>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  );
};

MyTickets.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets/my");

  return { myTickets: data };
};

export default MyTickets;
