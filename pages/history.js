import { atom, useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import React from "react";
import { useRouter } from "next/router";
import { Card, Button } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  if (!searchHistory) return null;

  let parsedHistory = [];

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation(); // stop the event from triggering other events
    // Call removeHistory API function to remove the history item
    await removeFromHistory(searchHistory[index]);
    // Update the atom with the new history after removing an item
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }

  return (
    <div>
      {parsedHistory.length == 0 ? (
        <Card>
          <Card.Body>
            <Card.Title>Nothing Here</Card.Title>
            <Card.Text>Try searching some new artwork.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              className={styles.historyListItem}
              onClick={(e) => historyClicked(e, index)}
            >
              {Object.keys(historyItem).map((key) => (
                <>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
