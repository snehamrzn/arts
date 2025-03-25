import { useAtom } from "jotai";
import { favoritesAtom } from "@/store";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "./components/ArtworkCard";
import React from "react";

export default function Favorites() {
  const [favoritesList] = useAtom(favoritesAtom);

  console.log("Favorites List:", favoritesList);
  return (
    <>
      <Row className="gy-4">
        {favoritesList.length > 0 ? (
          favoritesList.map((currentObjectID) => (
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
