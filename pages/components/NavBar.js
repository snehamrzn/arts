import Button from "react-bootstrap/Button";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { atom, useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import Link from "next/link";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function NavBar() {
  const token = readToken();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchField.trim()) {
      const queryString = `title=true&q=${encodeURIComponent(searchField)}`;
      const updatedHistory = await addToHistory(queryString);
      setSearchHistory(updatedHistory);
      router.push(`/artwork?${queryString}`);
    }
  };

  const handleLinkClick = () => {
    setIsExpanded(false);
  };

  return (
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
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Link href="/" passHref legacyBehavior>
              <Nav.Link
                active={router.pathname === "/"}
                onClick={handleLinkClick}
              >
                Home
              </Nav.Link>
            </Link>

            {token && (
              <Link href="/search" passHref legacyBehavior>
                <Nav.Link
                  active={router.pathname === "/search"}
                  onClick={handleLinkClick}
                >
                  Advanced Search
                </Nav.Link>
              </Link>
            )}
          </Nav>

          {token && (
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
          )}

          <Nav>
            {token ? (
              <NavDropdown title={token.userName} id="basic-nav-dropdown">
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
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav className="ms-auto">
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/register"}
                    onClick={handleLinkClick}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/login"}
                    onClick={handleLinkClick}
                  >
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
