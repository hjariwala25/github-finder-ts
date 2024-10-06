"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
const showResult = (singleUser) => {
    const { avatar_url, login, name, html_url, location, bio, public_repos, followers } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
        <img src="${avatar_url}" alt="${login}"/>
        <hr/>
        <div class="card-body">
          <h2>${name || login}</h2>
          <p>${bio || "No bio available"}</p>
          <p>Location: ${location || "Not specified"}</p>
          <p>Public Repos: ${public_repos}</p>
          <p>Followers: ${followers}</p>
        </div>
        <div class="card-footer">
          <a href="${html_url}" target="_blank">View on Github</a>
        </div>
      </div>`);
};
async function fetchUserData(username) {
    main_container.innerHTML = `<p class="loading-msg">Searching for user...</p>`;
    try {
        const userData = await myCustomFetcher(`https://api.github.com/users/${username}`);
        main_container.innerHTML = ''; // Clear previous results
        showResult(userData);
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        main_container.innerHTML = `<p class="empty-msg">No user found with the username "${username}". Please try again.</p>`;
    }
}
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const search = getUsername.value.trim();
    if (!search) {
        main_container.innerHTML = `<p class="empty-msg">Please enter a username to search.</p>`;
        return;
    }
    await fetchUserData(search);
});
async function loadInitialUsers() {
    const initialUsernames = ["octocat", "torvalds", "gaearon"];
    main_container.innerHTML = `<p class="loading-msg">Loading initial users...</p>`;
    try {
        for (const username of initialUsernames) {
            await fetchUserData(username);
        }
    }
    catch (error) {
        console.error("Error loading initial users:", error);
        main_container.innerHTML = `<p class="empty-msg">Error loading initial users. Please try searching for a specific user.</p>`;
    }
}
loadInitialUsers();
