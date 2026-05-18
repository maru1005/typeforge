// types/index.ts

export type Profile = {
    id: string;
    user_id: string;
    username: string;
};

export type Score = {
    id: string;
    user_id: string;
    correct_count: number;
    miss_count: number;
    created_at: string;
};

export type Category = "random" | "react" | "go" | "python" | "css" | "linux" | "cs" | "tailwind";