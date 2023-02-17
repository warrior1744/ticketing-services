import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";
import Layout from "@/components/layout";
import styles from "@/styles/AuthForm.module.css";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors, success } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  useEffect(() => {
    if (success) {
      setEmail("");
      setPassword("");
    }
  }, [success]);

  return (
    <Layout title="User Login">
      <div className={styles.auth}>
        <h1>
          <FaUser />
          Log In
        </h1>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type="submit" value="Login" className="btn" />
          {errors}
          <p>
            Don't Have an account ?{" "}
            <Link href="/auth/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Signin;
