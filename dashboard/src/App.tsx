import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchSessions, fetchArticles, SERVER_URL } from "./api";
import { ArticleList } from "./components/ArticleList";
import { DomainChart } from "./components/DomainChart";
import { RecentEvents } from "./components/RecentEvents";

function App() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadData();

    const socket = io(SERVER_URL);
    socket.on("newEvent", (event) => {
      setEvents((prev) => [event, ...prev]);
      loadData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [sessionsData, articlesData] = await Promise.all([
        fetchSessions(),
        fetchArticles()
      ]);
      setSessions(sessionsData);
      setArticles(articlesData);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">
            DiiD Reader Tracker Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Real-time tracking of reading behavior
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ArticleList articles={articles} sessions={sessions} />
          
          <div className="space-y-8">
            <DomainChart sessions={sessions} />
            <RecentEvents events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
