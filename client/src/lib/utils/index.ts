import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function dateFormatter(date: string | number | Date): string {
    const now = new Date();
    const targetDate = new Date(date);

    const timeDiff = Math.abs(now.getTime() - targetDate.getTime());
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    // const days = Math.floor(hours / 24);

    // Handle relative time formats
    if (seconds < 60) return "a few seconds ago";
    if (minutes === 1) return "1 min ago";
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;

    // Handle absolute date formatting
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric', // "2-digit" or "numeric"
        month: 'short', // "short", "long", or "numeric"
        year: 'numeric', // "2-digit" or "numeric"
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(targetDate);

    // If the date is within the current year, omit the year.
    const currentYear = now.getFullYear();
    return formattedDate.includes(currentYear.toString())
        ? formattedDate.replace(`, ${currentYear}`, '')
        : formattedDate;
}

