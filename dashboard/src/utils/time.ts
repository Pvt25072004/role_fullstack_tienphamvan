export const calculateDomainReadingTime = (sessions: any[]) => {
  return sessions.reduce((acc, curr) => {
    const readingTime =
      curr.total_reading_time !== undefined
        ? curr.total_reading_time
        : curr.end_time - curr.start_time;
    acc[curr.domain] = (acc[curr.domain] || 0) + readingTime;
    return acc;
  }, {} as Record<string, number>);
};

export const calculateArticleReadingTime = (sessions: any[], articleUrl: string) => {
  const articleSessions = sessions.filter((s) => s.url === articleUrl);
  const totalDurationMs = articleSessions.reduce(
    (acc, session) => {
      const sessionTime =
        session.total_reading_time !== undefined
          ? session.total_reading_time
          : session.end_time - session.start_time;
      return acc + sessionTime;
    },
    0,
  );
  return Math.floor(totalDurationMs / 1000);
};
