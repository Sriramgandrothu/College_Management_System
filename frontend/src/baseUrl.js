// baseurl.js
export const baseApiURL = () => {
  const url = process.env.REACT_APP_APILINK;
  // Remove trailing slashes if any to avoid errors
  return url ? url.replace(/\/+$/, "") : "";
};
