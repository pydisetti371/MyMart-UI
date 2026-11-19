import { lazy, Suspense, useState } from "react";
import { NavLink, Route, Routes } from "react-router";
import { AuthScreen } from "./auth/AuthScreen";
import { useAuth } from "./auth/AuthProvider";
import { UserMenu } from "./auth/UserMenu";
import { hostCopy, storeSections } from "./constants";

const BillingApp = lazy(() => import("billing/App"));
const ProductsApp = lazy(() => import("products/App"));
const ReportsApp = lazy(() => import("reports/App"));

const sectionIcons: Record<string, string> = {
  "/billing": "▤",
  "/products": "▣",
  "/reports": "▥",
};

function HomePage({
  sidebarOpen,
  userName,
}: {
  sidebarOpen: boolean;
  userName: string;
}) {
  return (
    <div className="home-shell">
      <aside
        className={`home-sidebar${sidebarOpen ? "" : " is-hidden"}`}
        id="store-sidebar"
      >
        <nav aria-label={hostCopy.navigation.ariaLabel} className="home-nav">
          {storeSections.map((section) => (
            section.enabled ? (
              <NavLink
                className={({ isActive }) =>
                  `home-nav-link${isActive ? " active" : ""}`
                }
                key={section.path}
                to={section.path}
              >
                <span aria-hidden="true" className="home-nav-icon">
                  {sectionIcons[section.path]}
                </span>
                <span>{section.label}</span>
              </NavLink>
            ) : (
              <span
                aria-disabled="true"
                className="home-nav-link is-disabled"
                key={section.path}
                title={hostCopy.navigation.comingSoon}
              >
                <span aria-hidden="true" className="home-nav-icon">
                  {sectionIcons[section.path]}
                </span>
                <span>{section.label}</span>
              </span>
            )
          ))}
        </nav>
      </aside>
      <main className="home-content">
        <h1>Welcome, {userName} to the VMart</h1>
        <p>{hostCopy.pages.chooseApp}</p>
      </main>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isReady, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="app-header">
        <div className="app-header-start">
          {user && (
            <button
              aria-controls="store-sidebar"
              aria-expanded={sidebarOpen}
              aria-label={
                sidebarOpen
                  ? hostCopy.menu.hideSidebar
                  : hostCopy.menu.showSidebar
              }
              className="app-menu-button"
              onClick={() => setSidebarOpen((isOpen) => !isOpen)}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
          <NavLink
            aria-label={hostCopy.brandAriaLabel}
            className="app-brand"
            end
            to="/billing"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="32"
              viewBox="0 0 24 24"
              width="32"
            >
              <path
                d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L22 8H7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M10 20h.01M18 20h.01M9 11l2 2 4-4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>{hostCopy.brand}</span>
          </NavLink>
        </div>
        {user && (
          <div className="app-header-end">
            <nav aria-label={hostCopy.navigation.ariaLabel} className="app-nav">
              {storeSections.map((section) =>
                section.enabled ? (
                  <NavLink
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " active" : ""}`
                    }
                    key={section.path}
                    to={section.path}
                  >
                    {section.label}
                  </NavLink>
                ) : (
                  <span
                    aria-disabled="true"
                    className="app-nav-link is-disabled"
                    key={section.path}
                    title={hostCopy.navigation.comingSoon}
                  >
                    {section.label}
                  </span>
                ),
              )}
            </nav>
            <UserMenu />
          </div>
        )}
      </header>

      {!isReady ? (
        <main className="auth-loading" aria-live="polite">
          {hostCopy.pages.loading}
        </main>
      ) : user ? (
        <Suspense fallback={<p className="p-6">{hostCopy.pages.loading}</p>}>
          <Routes>
            <Route
              element={
                <HomePage sidebarOpen={sidebarOpen} userName={user.name} />
              }
              path="/"
            />
            <Route
              element={<BillingApp sidebarOpen={sidebarOpen} />}
              path="/billing"
            />
            <Route
              element={<ProductsApp sidebarOpen={sidebarOpen} />}
              path="/products"
            />
            <Route
              element={<ReportsApp sidebarOpen={sidebarOpen} />}
              path="/reports"
            />
            <Route
              element={<main className="p-6">{hostCopy.pages.notFound}</main>}
              path="*"
            />
          </Routes>
        </Suspense>
      ) : (
        <AuthScreen />
      )}
    </div>
  );
}

export default App;
