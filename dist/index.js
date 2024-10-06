"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector(".form");
const main_container = document.querySelector(".main-container");
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    const data = response.json();
    console.log(data);
    return data;
}
function fetchUserData(url) {
    myCustomFetcher(url, {});
}
fetchUserData("https://api.github.com/users");
