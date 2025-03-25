import useSWR from "swr";
import Error from "next/error";
import { Button, Card } from "react-bootstrap";
import { useAtom } from "jotai";
import { favoritesAtom } from "@/store";
import { useState, useEffect } from "react";

export default function ArtworkCardDetail({ objectID }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null,
    fetcher
  );
  const [favoritesList, setFavoritesList] = useAtom(favoritesAtom);
  const [showAdded, setShowAdded] = useState(true);

  useEffect(() => {
    // Check if the artwork is already in the favorites list
    setShowAdded(favoritesList.includes(objectID));
    // console.log(showAdded);
  }, [favoritesList, objectID]);

  if (error) {
    return <Error statusCode={error.status || 500} />;
  }
  if (!data) {
    return null;
  }

  function favoritesClicked() {
    //if (!objectID) return;
    if (showAdded) {
      // Remove the artwork from the favorites list
      setFavoritesList((current) => current.filter((fav) => fav !== objectID));
      setShowAdded(false);
    } else {
      // Add the artwork to the favorites list
      setFavoritesList((current) => [...current, objectID]);
      setShowAdded(true);
      console.log(favoritesList);
    }
  }
  console.log(data);
  return (
    <>
      <Card className="alert alert-dismissible alert-warning">
        {data.primaryImage && (
          <Card.Img
            variant="top"
            src={
              data.primaryImage ||
              "https://placehold.co/375x375?text=Not+Available"
            }
          />
        )}
        <Card.Body>
          <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date:</strong>{" "}
            {data.accessionYear ? data.accessionYear : "N/A"} <br />
            <strong>Classification:</strong>{" "}
            {data.classification ? data.classification : "N/A"}
            <br />
            <strong>Medium:</strong> {data.medium ? data.medium : "N/A"}
            <br />
            <br />
            <strong>Artist: </strong>
            {""}
            {data.artistDisplayName ? (
              <>
                {data.artistDisplayName}{" "}
                {data.artistWikidata_URL && (
                  <a
                    href={data.artistWikidata_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-info"
                  >
                    (wiki)
                  </a>
                )}
              </>
            ) : (
              "N/A"
            )}
            <br />
            <strong>CreditLine:</strong>{" "}
            {data.creditLine ? data.creditLine : "N/A"} <br />
            <strong>Dimensions:</strong>{" "}
            {data.dimensions ? data.dimensions : "N/A"}
            <br />
            <br />
            <Button
              variant={showAdded ? "primary" : "outline-primary"}
              onClick={favoritesClicked}
            >
              {showAdded ? "Added to Favorites" : "Add to Favorites"}
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
