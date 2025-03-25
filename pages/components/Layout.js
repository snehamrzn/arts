import NavBar from "./NavBar";
import { Container } from "react-bootstrap";

const Layout = (props) => {
  return (
    <>
      <NavBar />
      <br />
      <Container>{props.children}</Container>
      <br />
    </>
  );
};

export default Layout;
