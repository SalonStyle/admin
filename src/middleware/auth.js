export async function isAuthenticated(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true, session };
}

// Middleware to check if user is super admin
export async function isSuperAdmin(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "super_admin") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Forbidden: Super Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}

// Middleware to check if user is salon admin
export async function isSalonAdmin(req) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "salon_admin" && session.user.role !== "super_admin")
  ) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Forbidden: Salon Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}
