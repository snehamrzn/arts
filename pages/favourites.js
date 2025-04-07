import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "./components/ArtworkCard";
import React from "react";
import { getToken } from "@/lib/authenticate";

export default function Favorites() {
  const [favouritesList] = useAtom(favouritesAtom);

  if (!favouritesList) return null;

  console.log("Favourites List:", favoritesList);
  return (
    <>
      <Row className="gy-4">
        {favouritesList.length > 0 ? (
          favouritesList.map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Nothing Here</Card.Title>
                <Card.Text>Try adding some new artwork to the list.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
}
