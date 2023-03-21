import axios from "axios";

const config = {
  headers: {
    "Content-type": "application/json",
  },
};

function getUserFn() {
  return axios
    .get("/auth/login/success", { withCredentials: true })
    .then((result) => result.data.user);
}

function logOut() {
  return axios
    .get("/auth/logout", { withCredentials: true })
    .then((result) => result.data === "logged out");
}

function addItemFn({ listName, listItem, userId }) {
  return axios
    .put("/list/add", { listName, listItem, userId }, config)
    .then((result) => result.data);
}

function createListFn({ listName, userId }) {
  return axios
    .put("/list/create", { listName, userId }, config)
    .then((result) => result.data);
}

function checkBoxFilledFn({ listName, listItemIndex, userId }) {
  return axios
    .put("/list/remove", { listName, listItemIndex, userId }, config)
    .then((result) => result.data);
}

function deleteClickedFn({ listName, userId }) {
  console.log("calling deleteClicked", listName);
  return axios
    .put("/list/deleteList", { listName, userId }, config)
    .then((result) => result.data);
}

export {
  getUserFn,
  logOut,
  addItemFn,
  createListFn,
  checkBoxFilledFn,
  deleteClickedFn,
};
