import Layout from "@/components/layout";
import styles from "@/styles/404.module.css";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFoundPage() {
  return (
    <Layout title="Page Not Found">
      <div className={styles.error}>
        <h1>
          <FaExclamationTriangle /> 404
        </h1>
        <h4>Oops, page not found</h4>
        <Link legacyBehavior href="/">
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
}

export default NotFoundPage;
