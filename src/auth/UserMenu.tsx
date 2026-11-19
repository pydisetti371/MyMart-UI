import { useAuth } from "./AuthProvider";

export function UserMenu() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div aria-label="Signed-in account" className="user-menu">
      <span aria-hidden="true" className="user-avatar">
        <svg fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </span>
      <span className="user-name" title={user.name}>
        {user.name}
      </span>
      <button
        aria-label="Sign out"
        className="signout-button"
        onClick={signOut}
        title="Sign out"
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M10 17l5-5-5-5M15 12H3" />
          <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
        </svg>
      </button>
    </div>
  );
}
