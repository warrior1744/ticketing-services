import React from "react";
import Layout from "@/components/layout";
import Ticket from "@/components/ticket";
import styles from "@/styles/Ticket.module.css";
import useRequest from "hooks/useRequest";
import Link from "next/link";
import Image from "next/image";

const MyTickets = ({ currentUser, myTickets }) => {
  console.log("mytickets", myTickets);

  const deleteRequest = (ticketId) => {
    console.log('ticketId', ticketId)

  };

  return (
    <div>
      <Layout>
        <h1>My Tickets for sell</h1>
        {myTickets.length === 0 && <h3>You have no tickets for sell</h3>}

        <ul>
          {myTickets.map((ticket) => (
            <li key={ticket.id}>
              <div className={styles.event}>
                <div className={styles.img}>
                  <Image
                    style={{ objectFit: "contain" }}
                    alt={ticket.title}
                    src={ticket.image || "/images/event-default.png"}
                    width={250}
                    height={250}
                  />
                </div>
                <div className={styles.info}>
                  {}
                  <h3>{ticket.title}</h3>
                </div>

                <div className={styles.link}>
                  <Link
                    legacyBehavior
                    href="/tickets/edit/[ticketId]"
                    as={`/tickets/edit/${ticket.id}`}
                  >
                    <a className="btn btn-secondary">Edit</a>
                  </Link>

                  <button onClick={() => deleteRequest(ticket.id)} className="btn ">
                    Remove
                  </button>
                </div>
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
