import axios from "axios";
import { useState } from "react";

const UseRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      setSuccess(false);
      const response = await axios[method](url, { ...body, ...props });
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
            <ul className="my-0">
              <li key={err.message}>Some Error occurs</li>
            </ul>
          </div>
        )
      );
    }
  };

  return { doRequest, errors, success };
};

export default UseRequest;
