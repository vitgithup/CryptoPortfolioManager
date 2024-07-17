import { Portfolio } from "@/interfaces/Portfolio";
import { User } from "@/interfaces/User";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    // console.log("fetchData")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    const response = await fetch(apiUrl+input, {...init, credentials: "include"});
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
    }
} 


export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/users", { method: "GET" });
    return response.json();
}



export interface SignUpCredentials {
    username: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}


export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/users/login",
        {
            
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        
    return response.json();
}

export async function logout() {
    await fetchData("/users/logout", { method: "POST" });
}



// ----------------------------

export async function fetchPortfolios(): Promise<Portfolio[]> {
    const response = await fetchData("/portfolio", { method: "GET" });
    return response.json();
}


export interface PortfolioInput {
    name: string;
    quantity: number;
}

export async function createPortfolio(cryptocurrency: PortfolioInput): Promise<Portfolio> {
    const response = await fetchData("/portfolio",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // withCredentials: true,
            body: JSON.stringify(cryptocurrency),
        });
    return response.json();
}

export async function updatePortfolio(cryptoId: number, cryptocurrency: PortfolioInput): Promise<Portfolio> {
    const response = await fetchData("/portfolio/" + cryptoId,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cryptocurrency),
        });
    return response.json();
}


export async function deletePortfolio(cryptoId: number) {
    await fetchData("/portfolio/" + cryptoId, { method: "DELETE" });
}