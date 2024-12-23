export function formatTime(
  seconds: number,
  includeMilliseconds: boolean = false,
): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds % 1) * 1000);

  const timeComponents: string[] = [];

  if (hours > 0) {
    timeComponents.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    timeComponents.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 || minutes > 0 || hours > 0) {
    timeComponents.push(`${remainingSeconds}s`);
  }

  if (includeMilliseconds && milliseconds > 0) {
    timeComponents.push(`${milliseconds}ms`);
  }

  return timeComponents.join(" ");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} Bytes`;
  }

  const units = ["KB", "MB", "GB", "TB", "PB"];
  let unitIndex = -1;
  let size = bytes;

  do {
    size /= 1024;
    unitIndex++;
  } while (size >= 1024 && unitIndex < units.length - 1);

  return `${size.toFixed(size % 1 === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
