// schemas/index.ts

import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("メールアドレスの形式で入力してください"),
    password: z.string().min(6,"6文字以上で入力してください"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

