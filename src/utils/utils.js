export function getISTLocalizedTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: true,
  };
  return now.toLocaleString('en-IN', options);
}
