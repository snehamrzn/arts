import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/authenticate";
import { favoritesAtom, searchHistoryAtom } from "@/store";
import { getFavorites, getHistory } from "@/lib/userData";
import { useAtom } from "jotai";

const PUBLIC_PATHS = ["/login", "/", "/_error", "/register"];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const [favoritesList, setFavoritesList] = useAtom(favoritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavoritesList(await getFavorites());
    setSearchHistory(await getHistory());
  }

  function authCheck(url) {
    const path = url.split("?")[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
      setAuthorized(false);
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }
  useEffect(() => {
    updateAtoms();
    authCheck(router.pathname);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  return <>{authorized && children}</>;
}
