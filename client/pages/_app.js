import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx); //individual page
  const { data } = await client.get("/api/users/currentuser");

  //getInitialProps in child components won't be called if _app.js has one, so here needs to be manually invoke the other getInitialProps.
  //check child components if has getInitialProps, if yes, then invoke them with ctx, client, and user data info, finally pass the context to AppComponent
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
