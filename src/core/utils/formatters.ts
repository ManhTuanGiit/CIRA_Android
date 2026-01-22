export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('vi-VN');
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('vi-VN');
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
