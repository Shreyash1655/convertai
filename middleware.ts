import { NextRequest, NextResponse } from "next/server";

const USERNAME = "shreyas";
const PASSWORD = "yourpassword";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  if (basicAuth) {
    const [scheme, encoded] = basicAuth.split(" ");
    if (scheme === "Basic") {
      const [user, pass] = atob(encoded).split(":");
      if (user === USERNAME && pass === PASSWORD) {
        return NextResponse.next();
      }
    }
  }
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
