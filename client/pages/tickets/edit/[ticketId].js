import { useState, useEffect } from "react";
import useRequest from "hooks/useRequest";
import { useRouter } from "next/router";
import Modal from "@/components/modal";
import Link from "next/link";
import Layout from "@/components/layout";
import styles from "@/styles/Form.module.css";
import { FaImage } from "react-icons/fa";
import ImageUpload from "@/components/imageUpload";
import Image from "next/image";

const EditTicket = ({ ticket, currentUser }) => {
  console.log("My ticket", ticket);
  const router = useRouter();
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(ticket.price);
  const [image, setImage] = useState(ticket.image || null);
  const [showModal, setShowModal] = useState(false);
  const [disableEdit, setDisableEdit] = useState(false);

  useEffect(() => {
    if (ticket.orderId) {
      setDisableEdit(true);
    }
  }, [disableEdit]);

  const { doRequest, errors, success } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: "put",
    body: {
      title: title,
      price: price,
      image: image,
    },
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onSuccess: () => router.push("/tickets/my"),
  });

  const {
    doRequest: deleteRequest,
    errors: deleteErrors,
    success: successRequest,
  } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: "delete",
    onSuccess: () => router.push("/tickets/my"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  const imageUploaded = async (uploadedImage) => {
    setImage(uploadedImage.url);
    setShowModal(false);
  };

  const deleteHandler = async () => {
    if (currentUser.id !== ticket.userId) {
      return;
    }
    if (ticket.orderId) {
      return;
    }
    if (confirm(`Are you sure to delete ${ticket.id} ?`)) {
      await deleteRequest();
    }
  };

  return (
    <Layout title="edit the ticket">
      <Link href="/tickets/my">Go Back</Link>
      {disableEdit ? (
        <h1 style={{ color: "red" }}>
          Unable to edit this Ticket as it is reserved or sold
        </h1>
      ) : (
        <h1>Edit my ticket</h1>
      )}
      <button onClick={deleteHandler} className="btn" disabled={disableEdit}>
        Remove this ticket
      </button>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            disabled={disableEdit}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            disabled={disableEdit}
          />
        </div>
        {errors}
        {deleteErrors}
        <input
          type="submit"
          value="Submit"
          className="btn"
          disabled={disableEdit}
        />
      </form>

      <h2>Ticket Image</h2>
      {image ? (
        <>
          <Image
            style={{ objectFit: "contain" }}
            alt={image}
            src={image}
            height={150}
            width={150}
          />
          <span>Require Submit to save the changes</span>
        </>
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}

      <div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowModal(true)}
          disabled={disableEdit}
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
