import axios from "axios";
import { useState } from "react";

const UseRequest = ({ url, method, body, onSuccess, config }) => {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  config = config || {};

  const doRequest = async (props = {}) => {
    console.log("url", url);
    try {
      setErrors(null);
      setSuccess(false);

      const response = await axios[method](url, { ...body, ...props }, config);
      if (onSuccess) {
        setSuccess(true);
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log("err", err);
      setErrors(
        err.response ? (
          <div className="alert alert-danger">
            <h4>Oops...</h4>
            <ul className="my-0">
              {err.response.data.errors.map((err) => {
                return <li key={err.message}>{err.message}</li>;
              })}
            </ul>
          </div>
        ) : (
          <div className="alert alert-danger">
            <h4>Oops...</h4>
            <div className="my-0">
              <p>Request Failed for some reason</p>
            </div>
          </div>
        )
      );
    }
  };

  return { doRequest, errors, success };
};

export default UseRequest;
