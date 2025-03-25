import { Card, Form, Alert, Button } from "react-bootstrap";
import { getToken, authenticateUser } from "@/lib/authenticate";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useAtom } from "jotai";
import { favoritesAtom, searchHistoryAtom } from "@/store";
import { getFavorites, getHistory } from "@/lib/userData";

export default function Login(props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const router = useRouter();

  const [favoritesList, setFavoritesList] = useAtom(favoritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const fetcher = (url) =>
    fetch(url, { headers: { Authorization: `JWT ${getToken()}` } }).then(
      (res) => res.json()
    );

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
    fetcher
  );

  async function updateAtoms() {
    setFavoritesList(await getFavorites());
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      await updateAtoms(); // Ensure data is set before redirecting
      router.push("/favorites");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>Enter your login information below:
        </Card.Body>
      </Card>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            value={user}
            id="userName"
            name="userName"
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">
          Login
        </Button>
        {warning && (
          <>
            <br />
            <Alert variant="danger">{warning}</Alert>
          </>
        )}
      </Form>
    </>
  );
}
