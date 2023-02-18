import Link from "next/link";
import Layout from "@/components/layout";
import Ticket from "@/components/ticket";

const Landing = ({ currentUser, tickets }) => {
  return (
    <div>
      <Layout>
        <h1>Available Tickets</h1>
        {tickets.length === 0 && <h3>No Ticket Available Right Now !</h3>}
        {tickets.map((ticket) => {
          return <Ticket key={ticket.id} ticket={ticket} />;
        })}
      </Layout>
    </div>
  );
};

Landing.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default Landing;
