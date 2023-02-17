import { useState, useEffect } from "react";
import styles from "@/styles/Form.module.css";
import axios from "axios";

function ImageUpload({ imageUploaded }) {
  const [formData, setFormData] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (uploadError) {
      setUploadError(null);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      setUploadError(
        <div className="alert alert-danger">
          <h4>! No chosen image</h4>
          <p>Please choose image less than 3mb</p>
        </div>
      );
      return;
    }
    try {
      const { data } = await axios.post("/api/tickets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      imageUploaded(data);
    } catch (error) {
      setUploadError(
        error.response ? (
          <div className="alert alert-danger">
            <h4>Image upload failed</h4>
            <ul className="my-0">
              {error.response.data.errors.map((err) => {
                return <li key={err.message}>{err.message}</li>;
              })}
            </ul>
          </div>
        ) : (
          <div className="alert alert-danger">
            <h4>Image upload failed</h4>
            <div className="my-0">
              <p>Request Failed for some reason</p>
            </div>
          </div>
        )
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.files[0].size > 3145728) {
      setUploadError(
        <div className="alert alert-danger">
          <h4>! Please choose smaller image</h4>
          <p>Image must be less than 3mb</p>
        </div>
      );
      return;
    }
    const formDataCreate = new FormData();
    formDataCreate.append("image", file);
    setUploadError(null)
    setFormData(formDataCreate);
  };

  return (
    <div className={styles.form}>
      <h1>Image Upload</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>
        <input type="submit" value="Upload" className="btn" />
      </form>
      {uploadError}
    </div>
  );
}

export default ImageUpload;
