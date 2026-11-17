import { lazy, Suspense, useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router";
import { hostCopy, storeSections } from "./constants";

const BillingApp = lazy(() => import("billing/App"));
const ProductsApp = lazy(() => import("products/App"));
const ReportsApp = lazy(() => import("reports/App"));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const closeSidebarOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

      const clickedSidebar = event.target.closest("#store-sidebar");
      const clickedMenuButton = event.target.closest(".app-menu-button");

      if (!clickedSidebar && !clickedMenuButton) {
        setSidebarOpen(false);
      }
    };

    const closeSidebarOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    document.addEventListener("pointerdown", closeSidebarOnOutsideClick);
    document.addEventListener("keydown", closeSidebarOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeSidebarOnOutsideClick);
      document.removeEventListener("keydown", closeSidebarOnEscape);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="app-header">
        <div className="app-header-start">
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
        <nav aria-label={hostCopy.navigation.ariaLabel} className="app-nav">
          {storeSections.map((section) => (
            <NavLink
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              key={section.path}
              to={section.path}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Suspense fallback={<p className="p-6">{hostCopy.pages.loading}</p>}>
        <Routes>
          <Route
            element={<main className="p-6">{hostCopy.pages.chooseApp}</main>}
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
    </div>
  );
}

export default App;
