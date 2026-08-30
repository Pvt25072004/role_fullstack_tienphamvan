import moment from "moment";

export const RecentEvents = ({ events }: { events: any[] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Events</h2>
      <div className="space-y-3 h-64 overflow-y-auto">
        {events.slice(0, 20).map((evt, idx) => (
          <div key={idx} className="text-sm border-l-2 border-blue-500 pl-3">
            <span className="font-semibold text-gray-700">{evt.event_type}</span>
            <span className="text-gray-400 ml-2">
              {moment(evt.timestamp).format("HH:mm:ss")}
            </span>
            <p className="text-xs text-gray-500 truncate mt-1">{evt.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
