import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token"); // Ambil token dari cookies

    console.log("Middleware berjalan...");
    console.log("Token dari cookies:", token);
    console.log("Pathname:", req.nextUrl.pathname);

    const isLoginOrRegister =
        req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";

    // Jika user sudah login, redirect dari login/register ke dashboard
    if (token && isLoginOrRegister) {
        console.log("User sudah login, redirect ke /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Jika user belum login dan mencoba masuk ke halaman lain, redirect ke login
    if (!token && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register") {
        console.log("User belum login, redirect ke /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/login", "/register"], // Middleware berjalan di halaman ini
};
