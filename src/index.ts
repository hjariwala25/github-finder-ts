const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector(".form") as HTMLFormElement;
const main_container = document.querySelector(".main-container") as HTMLElement;


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
    const data = response.json();
    console.log(data);
    
    return data;
 
}

function fetchUserData(url: string){
    myCustomFetcher<UserData[]>(url, {});
}

fetchUserData("https://api.github.com/users");

