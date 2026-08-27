import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const SERVER_URL = 'http://localhost:3000';

function App() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchData();

    const socket = io(SERVER_URL);
    socket.on('newEvent', (event) => {
      setEvents((prev) => [event, ...prev]);
      fetchData(); // Refresh aggregated data
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const sessRes = await axios.get(`${SERVER_URL}/api/sessions`);
      setSessions(sessRes.data);
      const artRes = await axios.get(`${SERVER_URL}/api/articles`);
      setArticles(artRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const domainData = sessions.reduce((acc, curr) => {
    acc[curr.domain] = (acc[curr.domain] || 0) + (curr.end_time - curr.start_time);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(domainData),
    datasets: [
      {
        data: Object.values(domainData).map((v: any) => v / 1000), // in seconds
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">DiiD Reader Tracker Dashboard</h1>
          <p className="text-gray-500 mt-2">Real-time tracking of reading behavior</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Articles Read</h2>
            <div className="space-y-4">
              {articles.map((article, idx) => {
                const session = sessions.find(s => s.url === article.url);
                const duration = session ? Math.floor((session.end_time - session.start_time) / 1000) : 0;
                
                return (
                  <div key={idx} className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-bold text-lg text-blue-600">
                      <a href={article.url} target="_blank" rel="noreferrer">{article.title || 'Unknown Title'}</a>
                    </h3>
                    <p className="text-sm text-gray-500">{article.domain}</p>
                    <p className="text-sm text-gray-700 mt-2">Total Reading Time: {duration} seconds</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{article.content}</p>
                  </div>
                );
              })}
              {articles.length === 0 && <p className="text-gray-500">No articles read yet.</p>}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Reading Time by Domain (s)</h2>
              <Pie data={pieData} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Events</h2>
              <div className="space-y-3 h-64 overflow-y-auto">
                {events.slice(0, 20).map((evt, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-blue-500 pl-3">
                    <span className="font-semibold text-gray-700">{evt.event_type}</span>
                    <span className="text-gray-400 ml-2">{moment(evt.timestamp).format('HH:mm:ss')}</span>
                    <p className="text-xs text-gray-500 truncate mt-1">{evt.url}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
