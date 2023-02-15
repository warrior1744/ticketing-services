import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Ticket.module.css";

function Ticket({ ticket }) {
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          style={{ objectFit: "contain" }}
          alt={ticket.title}
          src={ticket.image}
          width={250}
          height={250}
        />
      </div>

      <div className={styles.info}>
        {/* <span>
          {new Date(evt.date).toLocaleDateString("zh-TW")} at {ticket.date}
        </span> */}
        <h3>{ticket.title}</h3>
      </div>

      <div className={styles.link}>
        <Link
          legacyBehavior
          href="/tickets/[ticketId]"
          as={`/tickets/${ticket.id}`}
        >
          <a className="btn">Buy</a>
        </Link>
      </div>
    </div>
  );
}

export default Ticket;
