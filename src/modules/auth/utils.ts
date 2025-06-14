import { cookies as getCookies } from "next/headers";

interface Props {
    prefix: string;
    value: string
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
    const cookies = await getCookies();

    cookies.set({
        name: `${prefix}-token`,
        value: value,
        httpOnly: true,
        path: "/",
        ...(process.env.NEXT_PUBLIC_SUBDOMAIN_ROUTING_ENABLED === "true" && {
            sameSite: "none",
            domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
            secure: true
        })
    })
}