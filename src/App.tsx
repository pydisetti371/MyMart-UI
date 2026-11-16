import { lazy, Suspense } from "react";
import { NavLink, Route, Routes } from "react-router";

const BillingApp = lazy(() => import("billing/App"));
const ProductsApp = lazy(() => import("products/App"));
const ReportsApp = lazy(() => import("reports/App"));

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          My cart
        </h1>
        <nav aria-label="Micro frontend apps" className="flex gap-2">
          <NavLink
            className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
            to="/billing"
          >
            Billing
          </NavLink>
          <NavLink
            className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
            to="/products"
          >
            Products
          </NavLink>
          <NavLink
            className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
            to="/reports"
          >
            Reports
          </NavLink>
        </nav>
      </header>

      <Suspense fallback={<p className="p-6">Loading app...</p>}>
        <Routes>
          <Route
            element={<main className="p-6">Choose an app from the menu.</main>}
            path="/"
          />
          <Route element={<BillingApp />} path="/billing" />
          <Route element={<ProductsApp />} path="/products" />
          <Route element={<ReportsApp />} path="/reports" />
          <Route
            element={<main className="p-6">Page not found.</main>}
            path="*"
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
