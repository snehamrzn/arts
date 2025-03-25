import { Card, Form, Alert, Button } from "react-bootstrap";
import { getToken, registerUser } from "@/lib/authenticate";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Register(props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [warning, setWarning] = useState("");
  const router = useRouter();

  const fetcher = (url) =>
    fetch(url, { headers: { Authorization: `JWT ${getToken()}` } }).then(
      (res) => res.json()
    );

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
    fetcher
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerUser(user, password, password2);
      await updateAtoms(); // Ensure data is set before redirecting
      router.push("/login");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Register</h2>Register for an account:
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
        <Form.Group>
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            value={password2}
            id="password"
            name="password"
            onChange={(e) => setPassword2(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">
          Register
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
