import useSWR from "swr";
import Error from "next/error";
import { Button, Card } from "react-bootstrap";
import Link from "next/link";

export default function ArtworkCard({ objectID }) {
  const { data, error, isLoading } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) {
    return <Error statusCode={error.status || 500} />;
  }
  if (!data) {
    return null;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(data);
  return (
    <>
      <Card>
        <Card.Img
          variant="top"
          src={
            data.primaryImageSmall ||
            "https://placehold.co/375x375?text=Not+Available"
          }
        />
        <Card.Body>
          <Card.Title>{data.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date:</strong> {data.accessionYear || "N/A"} <br />
            <strong>Classification:</strong> {data.classification || "N/A"}{" "}
            <br />
            <strong>Medium:</strong> {data.medium || "N/A"}
          </Card.Text>

          <Link href={`/artwork/${data.objectID}`} passHref>
            <Button className="btn btn-dark" variant="primary">
              <strong>ID: </strong>
              {data.objectID}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}
