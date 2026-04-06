import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./shared/lib/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Мгновенно пропускаем системные запросы и статику
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.split("/").pop()?.includes(".") // Проверка на расширение файла
  ) {
    return NextResponse.next();
  }

  // 2. Получаем текущую локаль из пути (если она есть)
  const segments = pathname.split("/");
  const currentLocale = routing.locales.includes(segments[1] as any)
    ? segments[1]
    : routing.defaultLocale;

  // 3. Сначала даем отработать i18n middleware
  const response = intlMiddleware(request);

  // 4. Проверка авторизации
  const accessToken = request.cookies.get("accessToken");
  const isDashboard = pathname.match(/^\/(ru|en)?\/?dashboard/);
  const isAuthPage = pathname.match(/^\/(ru|en)?\/?(login|register)/);

  // Функция для создания редиректа с сохранением локали и параметров (RSC)
  const createRedirect = (targetPath: string) => {
    // Важно: добавляем локаль в путь, чтобы избежать 307 от next-intl
    const url = new URL(`/${currentLocale}${targetPath}`, request.url);
    url.search = search; // Сохраняем ?_rsc=... и другие параметры
    return NextResponse.redirect(url);
  };

  if (isDashboard && !accessToken) {
    return createRedirect("/login");
  }

  if (isAuthPage && accessToken) {
    return createRedirect("/dashboard");
  }

  return response;
}

export const config = {
  // Исключаем лишнее через matcher, чтобы Middleware даже не вызывался для картинок
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|.*\\..*).*)",
  ],
};
