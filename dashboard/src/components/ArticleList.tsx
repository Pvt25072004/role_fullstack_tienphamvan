import { calculateArticleReadingTime } from "../utils/time";

interface ArticleListProps {
  articles: any[];
  sessions: any[];
}

export const ArticleList = ({ articles, sessions }: ArticleListProps) => {
  return (
    <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Articles Read</h2>
      <div className="space-y-4">
        {articles.map((article, idx) => {
          const duration = calculateArticleReadingTime(sessions, article.url);

          return (
            <div key={idx} className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-bold text-lg text-blue-600">
                <a href={article.url} target="_blank" rel="noreferrer">
                  {article.title || "Unknown Title"}
                </a>
              </h3>
              <p className="text-sm text-gray-500">{article.domain}</p>
              <p className="text-sm text-gray-700 mt-2">
                Total Reading Time: {duration} seconds
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {article.content}
              </p>
            </div>
          );
        })}
        {articles.length === 0 && (
          <p className="text-gray-500">No articles read yet.</p>
        )}
      </div>
    </div>
  );
};
