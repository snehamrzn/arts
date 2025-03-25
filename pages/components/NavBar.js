import Button from "react-bootstrap/Button";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchField, setSearchField] = useState("");
  //   const { search } = router.query;
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchField.trim()) {
      const queryString = `title=true&q=${encodeURIComponent(searchField)}`;
      setSearchHistory((current) => [...current, queryString]);
      router.push(`/artwork?${queryString}`);
    }
  };

  const handleLinkClick = () => {
    setIsExpanded(false); // Collapse navbar when any link is clicked
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        data-bs-theme="dark"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand href="#">Sneha Maharjan</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbarScroll"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link href="/" passHref onClick={handleLinkClick} legacyBehavior>
                <Nav.Link active={router.pathname === "/"}>Home</Nav.Link>
              </Link>

              <Link
                href="/search"
                passHref
                onClick={handleLinkClick}
                legacyBehavior
              >
                <Nav.Link active={router.pathname === "/search"}>
                  Advanced Search
                </Nav.Link>
              </Link>
            </Nav>
            &nbsp;
            <Form className="d-flex" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setSearchField(e.target.value)}
              />
              <Button type="submit" className="btn btn-secondary my-2 my-sm-0">
                Search
              </Button>
            </Form>
            &nbsp;
            <Nav>
              <NavDropdown title="UserName" id="basic-nav-dropdown">
                <Link href="/favorites" passHref legacyBehavior>
                  <NavDropdown.Item active={router.pathname === "/favorites"}>
                    Favorites
                  </NavDropdown.Item>
                </Link>
                <Link href="/history" passHref legacyBehavior>
                  <NavDropdown.Item active={router.pathname === "/history"}>
                    History
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <br />
    </>
  );
}
