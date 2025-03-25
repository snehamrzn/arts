/*********************************************************************************
 * BTI425 – Assignment 4
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: __Sneha Maharjan___ Student ID: ___17081222____ Date: ___2025-02-07_____
 *
 ********************************************************************************/
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Error from "next/error";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "../components/ArtworkCard";
import { Pagination } from "react-bootstrap";
import validObjectIDList from "@/public/data/validObjectIDList.json";

const PER_PAGE = 12;
const page = 1;

export default function List() {
  const [page, setPage] = useState(1);
  const [artworkList, setArtworkList] = useState([]);

  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  const { data, error, isLoading } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );

  useEffect(() => {
    if (data) {
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );
      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      // for (let i = 0; i < data?.objectIDs?.length; i += PER_PAGE) {
      //   const chunk = data?.objectIDs.slice(i, i + PER_PAGE);
      //   results.push(chunk);
      // }
      setArtworkList(results);
    }
    setPage(1);
  }, [data]);

  function Previous() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }
  function Next() {
    if (page < artworkList.length) {
      setPage((prev) => prev + 1);
    }
  }
  if (error) {
    return <Error statusCode={error.status || 500} />;
  }
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))
        ) : (
          <Card className="alert alert-dismissible alert-danger">
            <Card.Body>
              <Card.Title>Nothing Here</Card.Title>
              <Card.Text>Try searching for something else.</Card.Text>
            </Card.Body>
          </Card>
        )}
      </Row>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          <Col>
            {" "}
            <br />
            <Pagination>
              <Pagination.Prev onClick={Previous} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={Next} />
            </Pagination>
          </Col>
        ) : (
          ""
        )}
      </Row>
    </>
  );
}
