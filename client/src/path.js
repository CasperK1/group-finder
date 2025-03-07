// src/path.js

export const apiBaseURL = `${process.env.REACT_APP_GROUP_FINDER}/api`;

export const apiPaths = {
  users: `${apiBaseURL}/users`,
  auth: `${apiBaseURL}/auth`,
  groups: `${apiBaseURL}/groups`,
  files: `${apiBaseURL}/files`,
};
