import { useState, useEffect } from "react";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import Modal from "@/components/modal";
import Link from "next/link";
import Layout from "@/components/layout";
import styles from "@/styles/Form.module.css";
import { FaImage } from "react-icons/fa";
import ImageUpload from "@/components/imageUpload";
import axios from "axios";

const EditTicket = ({ ticket, currentUser }) => {
  const router = useRouter();
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(ticket.price);
  const [image, setImage] = useState("/images/event-default.png");
  const [showModal, setShowModal] = useState(false);
  // const { doRequest, errors, success } = useRequest({
  //   url: `/api/ticket/${ticket.id}`,
  //   method: "put",
  //   body: {
  //     ticketId: ticket.id,
  //     title,
  //     price,
  //     image
  //   },
  //   onSuccess: () => console.log("update ok"),
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { title: title, price: price, image: image };
      const { data } = await axios.put(`/api/tickets/${ticket.id}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("data", data);
    } catch (error) {
      throw new Error("data update failed");
    }
    // await doRequest()
  };

  const imageUploaded = async (uploadedImage) => {
    console.log("uploadedImage", uploadedImage);
    setImage(uploadedImage.url);
    setShowModal(false);
  };

  return (
    <Layout title="edit the ticket">
      <Link href="/tickets/my">Go Back</Link>
      <h1>Edit my ticket</h1>
      <form onSubmit={handleSubmit} className={styles.Form}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <input type="submit" value="submit" className="btn" />
      </form>

      <h2>Ticket Image</h2>
      <div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowModal(true)}
        >
          <FaImage /> Set Image
        </button>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <ImageUpload ticketId={ticket.id} imageUploaded={imageUploaded} />
        </Modal>
      </div>
    </Layout>
  );
};

EditTicket.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default EditTicket;
