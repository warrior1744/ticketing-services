import { useState, useEffect } from "react";
import Router from 'next/router'
import useRequest from "../../hooks/useRequest";

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors, success} = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
        email, password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest()
  };

  useEffect(() => {
    if(success){
        setEmail('')
        setPassword('')
    }
  }, [success])

  return (
    <form onSubmit={onSubmit}>
      <div className="container">
        <h1>signin</h1>
        <div className="form-group mb-3">
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        <button className="btn btn-primary mb-3">Sign In</button>
        {errors}
        {success}
      </div>
    </form>
  );
};

export default signin;
