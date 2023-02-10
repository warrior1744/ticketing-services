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

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx); //individual page
  const { data } = await client.get("/api/users/currentuser");

  //Manually invoke the Landing page getInitialProps function
  let pageProps = {};
  //check child component (Landing page has getInitialProps), if yes, then pass the context, client and currentUser as arguments to index.js
  if (appContext.Component.getInitialProps) {

    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  //pass child props to AppComponent
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
