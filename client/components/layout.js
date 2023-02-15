import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import Showcase from "./showcase";
import styles from "@/styles/Layout.module.css";
import { useRouter } from "next/router";

function Layout({ title, keywords, description, children }) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      {router.pathname === "/" && <Showcase />}

      <Footer />

      <div className={styles.container}>{children}</div>
    </div>
  );
}

Layout.defaultProps = {
  title: "DJ Events | Find the hottest parties",
  description: "Find the latest DJ and other musical events",
  keywords: "music, dj, edm, events",
};

export default Layout;
