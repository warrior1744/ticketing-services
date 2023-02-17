import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";
import Layout from "@/components/layout";
import styles from "@/styles/AuthForm.module.css";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { doRequest, errors, success } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      username,
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
      setUsername("");
    }
  }, [success]);

  return (
    <Layout title="User Sign Up">
      <div className={styles.auth}>
        <h1>
          <FaUser />
          Sign Up
        </h1>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <input type="submit" value="Register" className="btn" />
          {errors}
          <p>
            Already Have an account ? <Link href="/auth/signin">Log In</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
