import { useState } from "react";
import styles from "@/styles/Form.module.css";
import useRequest from "hooks/useRequest";
import axios from "axios";

function ImageUpload({ imageUploaded }) {
  const [formData, setFormData] = useState(null);

  // const { doRequest, errors, success } = useRequest({
  //     url: "/api/tickets/upload",
  //     method: "post",
  //     body: formData,
  //     onSuccess: () => console.log('image uploaded'),
  //   });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/tickets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      imageUploaded(data);
    } catch (error) {
      throw new Error('Error while uploading the file')
    }
  };

  const handleFileChange = (e) => {

    const file = e.target.files[0]
    const formData = new FormData();
    formData.append("image", file);
    setFormData(formData)
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
    </div>
  );
}

export default ImageUpload;
