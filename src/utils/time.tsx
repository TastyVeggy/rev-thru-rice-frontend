import { format, formatDistanceToNow } from 'date-fns';

export const timeAgo = (postgresDate: string) => {
  const date = new Date(postgresDate);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const postgrestCurrentTimestamp = () => {
  const now = new Date();
  return format(now, 'yyyy-MM-dd HH:mm:ss');
};
