const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector(".form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;


interface UserData{
    id:number
    login:string
    avatar_url:string
    location:string
    url:string
}

async function myCustomFetcher<T>(url:string, options?:RequestInit):Promise<T>{
    const response = await fetch(url, options);
    if(!response.ok){
        throw new Error(
            `Network response was not ok - status: ${response.status}`
        );
    }
    const data = await response.json();
    console.log(data);
    
    return data;
 
}

const showResult = (singleUser: UserData) => {
    const {avatar_url, login, url, location} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src=${avatar_url} alt=${login}/>
        <hr/>
        <div class="card-footer">
        <img src="${avatar_url}" alt="${login}/>
        <a href="${url}">Github </a>
        </div>
        </div>
        `
    )
}

function fetchUserData(url: string){
    myCustomFetcher<UserData[]>(url, {}).then((userInfo) => {
        for(const singleUser of userInfo){
            showResult(singleUser);
        }
    })
}

fetchUserData("https://api.github.com/users");

