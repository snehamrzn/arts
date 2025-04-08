// import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/sketchy/bootstrap.min.css";
import Layout from "./components/Layout.js";
import RouteGuard from "./components/RouteGuard.js";

import { SWRConfig } from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <SWRConfig value={{ fetcher }}>
        <RouteGuard>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RouteGuard>
      </SWRConfig>
    </>
  );
}
