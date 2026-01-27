//@ts-ignore
export const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
export const HEADER_HEIGHT = 160;

export const formatTime = (time: number | null): string => {
  if (time === null) return 'BYBIS';
  if (time < 0) return 'Euroton ended. Get a LIFE now!';

  let days: string | number = Math.floor(time / (60 * 60 * 24));
  let hours: string | number = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
  let minutes: string | number = Math.floor((time % (60 * 60)) / 60);
  let seconds: string | number = Math.floor(time % 60);

  days = days > 0 ? days + 'd ' : '';
  hours = hours > 0 ? hours + 'h ' : '';
  minutes = `${minutes < 10 ? '0' + minutes : minutes}m `;
  seconds = `${seconds < 10 ? '0' + seconds : seconds}s`;

  return days + hours + minutes + seconds;
};

export const formatDate = (date: Date): string => {
  // if date is recent add how long ago it was, otherwise return full exact date
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffInDays = diff / (1000 * 3600 * 24);

  if (diffInDays < 1) {
    const diffInHours = diff / (1000 * 3600);
    if (diffInHours < 1) {
      const diffInMinutes = diff / (1000 * 60);
      if (diffInMinutes < 1) {
        const diffInSeconds = diff / 1000;
        return `${Math.floor(diffInSeconds)}s ago`;
      }
      return `${Math.floor(diffInMinutes)}m ago`;
    }
    return `${Math.floor(diffInHours)}h ago`;
  }

  return date.toLocaleString();
};

export const cssToJson = (css: string): { [key: string]: string } => {
  css = css.trim();
  const json: { [key: string]: string } = {};
  const properties = css.split(';').filter(Boolean);

  for (let prop of properties) {
    let [key, value] = prop.split(':').map((p) => p.trim());
    json[key] = value;
  }

  return json;
};

export const jsonToCss = (json: { [key: string]: string | number }): string => {
  let css = '';

  for (let property in json) {
    css += `${property}: ${json[property]};
`;
  }

  return css.trim();
};
