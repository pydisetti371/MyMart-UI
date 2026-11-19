import { NavLink } from "react-router";
import { Icon, type IconName } from "./BillingIcons";
import { billingCopy } from "./constants";

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: IconName;
  label: string;
}) {
  const content = (
    <>
      <Icon name={icon} size={21} />
      <span>{label}</span>
    </>
  );

  if (href === "/products" || href === "/reports") {
    return (
      <span
        aria-disabled="true"
        className="nav-link is-disabled"
        title={billingCopy.navigation.comingSoon}
      >
        {content}
      </span>
    );
  }

  if (href.startsWith("/")) {
    return (
      <NavLink
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        end
        to={href}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <a className="nav-link" href={href}>
      {content}
    </a>
  );
}

export function BillingSidebar({
  sidebarOpen = true,
}: {
  sidebarOpen?: boolean;
}) {
  return (
    <aside
      className={`sidebar${sidebarOpen ? "" : " is-hidden"}`}
      id="store-sidebar"
    >
      <nav aria-label={billingCopy.navigation.ariaLabel} className="side-nav">
        {(
          [
            ["receipt", billingCopy.navigation.billing, "/billing"],
            ["inventory", billingCopy.navigation.products, "/products"],
            ["chart", billingCopy.navigation.reports, "/reports"],
          ] as const
        ).map(([icon, label, href]) => (
          <SidebarLink href={href} icon={icon} key={label} label={label} />
        ))}
      </nav>

      <div className="store-time">
        <Icon name="sun" size={22} />
        <span>
          {billingCopy.store.date}
          <br />
          <strong>{billingCopy.store.time}</strong>
        </span>
      </div>
    </aside>
  );
}
