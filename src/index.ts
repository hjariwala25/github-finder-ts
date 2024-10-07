const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;

interface UserData {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  location: string | null;
  followers: number;
  public_repos: number;
}

async function myCustomFetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }
    throw new Error(`Network response was not ok - status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

const showResult = (singleUser: UserData) => {
  const { avatar_url, login, name, html_url, location, followers, public_repos } = singleUser;
  main_container.insertAdjacentHTML(
    "beforeend",
    `<div class='card'>  
      <img src=${avatar_url} alt=${login} /> 
      <hr /> 
      <div class="card-body">
        <h3>${name || login}</h3>
        <p>Username: ${login}</p>
        <p>Location: ${location || 'Not available'}</p>
        <p>Followers: ${followers}</p>
        <p>Public Repos: ${public_repos}</p>
      </div>
      <div class="card-footer"> 
        <a href="${html_url}" target="_blank">Github Profile</a> 
      </div> 
    </div>`
  );
};

async function fetchUserData(url: string) {
  try {
    const userData = await myCustomFetcher<UserData[]>(url);
    main_container.innerHTML = "";
    for (const singleUser of userData) {
      showResult(singleUser);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    main_container.innerHTML = `<p>${error instanceof Error ? error.message : "Error fetching user data. Please try again later."}</p>`;
  }
}

// Initial load of users
fetchUserData("https://api.github.com/users?per_page=10");

formSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchTerm = getUsername.value.trim();
  // console.log("Search term:", searchTerm);  

  if (!searchTerm) {
    
    fetchUserData("https://api.github.com/users?per_page=10");
    return;
  }

  try {
    main_container.innerHTML = "<p>Searching...</p>";
    
    // Use search API
    const url = `https://api.github.com/search/users?q=${encodeURIComponent(searchTerm)}`;
    const searchData = await myCustomFetcher<{ items: UserData[] }>(url);

    main_container.innerHTML = "";

    if (searchData.items.length === 0) {
      main_container.innerHTML = "<p class='empty-msg'>No matching users found.</p>";
    } else {
      for (const user of searchData.items) {
        try {
         
          const detailedUser = await myCustomFetcher<UserData>(`https://api.github.com/users/${user.login}`);
          showResult(detailedUser);
        } catch (error) {
          console.error(`Error fetching details for user ${user.login}:`, error);
          
          showResult(user);
        }
      }
    }
  } catch (error) {
    console.error("Error during search:", error);
    main_container.innerHTML = `<p>${error instanceof Error ? error.message : "An error occurred during the search. Please try again."}</p>`;
  }
});


// formSubmit.addEventListener('submit', (e) => {
//   console.log('Form submitted');
// });

// getUsername.addEventListener('input', (e) => {
//   console.log('Current input value:', (e.target as HTMLInputElement).value);
// });


