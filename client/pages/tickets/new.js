import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";
import Layout from "@/components/layout";
import styles from "@/styles/Form.module.css"
import Link from "next/link";

const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors, success } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  useEffect(() => {
    if (success) {
      setTitle("");
      setPrice("");
    }
  }, [success]);

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value) || !Number.isInteger(value)) {
      return;
    }

    setPrice(value.toFixed(0));
  };

  return (
    <div>
      <Layout title="Create a new ticket">
        <Link href="/">Go back</Link>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit} className={styles.form}>
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
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        {success}
        <button className="btn btn-primary">Submit</button>
      </form>
      </Layout>
    </div>
  );
};

export default NewTicket;
