export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/class-definition/:path*",
    "/class-profile/:path*",
    "/generated-plan/:path*",
    "/manage-class-profiles/:path*",
    "/new-class-profile/:path*",
    "/observations/:path*",
    "/template-selection/:path*",
  ],
}