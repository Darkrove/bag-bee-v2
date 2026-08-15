import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

interface TimeAgoProps {
  date: string | Date;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  const targetDate = new Date(date);
  const now = new Date();

  const minutes = differenceInMinutes(now, targetDate);
  const hours = differenceInHours(now, targetDate);
  const days = differenceInDays(now, targetDate);

  let timeAgo: string;

  if (minutes < 1) {
    timeAgo = "Just now";
  } else if (minutes < 60) {
    timeAgo = `${minutes}m`;
  } else if (hours < 24) {
    timeAgo = `${hours}h`;
  } else {
    timeAgo = `${days}d`;
  }

  return <span>{timeAgo} ago</span>;
}