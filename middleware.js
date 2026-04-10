export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect everything except the login page, api/auth routes, and static files
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|avatars).*)",
  ],
};
