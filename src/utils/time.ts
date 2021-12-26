export const getTimeAgo = (date: Date): string => {
  const dateDiff = Date.now() - +date;
  const diffMinutes = Math.ceil(dateDiff / (1000 * 60));
  const diffHours = Math.ceil(diffMinutes / 60);
  const diffDays = Math.ceil(diffHours / 24);

  if (diffMinutes < 60) return `${diffMinutes} m`;
  else if (diffHours < 24) return `${diffHours} h`;
  return `${diffDays} d`;
};
