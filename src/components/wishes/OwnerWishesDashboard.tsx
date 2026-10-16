"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseClient, type Wish } from "@/lib/supabase";
import { WishOwnerLogin, WishPasswordSettings, useWishAuth } from "./WishAuth";

type AccessState = "checking" | "owner" | "unauthorized" | "error" | "unconfigured";
const PAGE_SIZE = 1000;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

export function OwnerWishesDashboard() {
  const auth = useWishAuth();
  const [access, setAccess] = useState<AccessState>("checking");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (auth.loading) return;
    let active = true;
    void Promise.resolve().then(async () => {
      if (!auth.configured) {
        if (active) setAccess("unconfigured");
        return;
      }
      if (auth.error) {
        if (active) setAccess("error");
        return;
      }
      if (!auth.user) {
        if (active) setAccess("unauthorized");
        return;
      }

      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          if (active) setAccess("unconfigured");
          return;
        }
        const { data, error } = await supabase
          .from("wish_owners")
          .select("user_id")
          .eq("user_id", auth.user.id)
          .maybeSingle();
        if (error) throw error;
        if (active) setAccess(data ? "owner" : "unauthorized");
      } catch (error) {
        console.error("Unable to verify wishes owner access.", error);
        if (active) setAccess("error");
      }
    });
    return () => {
      active = false;
    };
  }, [auth.configured, auth.error, auth.loading, auth.user]);

  useEffect(() => {
    if (access !== "owner") return;
    let active = true;
    void Promise.resolve().then(async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const supabase = getSupabaseClient();
        if (!supabase) throw new Error("The wishes database is not configured.");
        const all: Wish[] = [];
        for (let from = 0; ; from += PAGE_SIZE) {
          const { data, error } = await supabase
            .from("wishes")
            .select("id, author_id, guest_name, message, created_at, updated_at, deleted_at")
            .order("created_at", { ascending: false })
            .order("id", { ascending: false })
            .range(from, from + PAGE_SIZE - 1);
          if (error) throw error;
          all.push(...(data ?? []));
          if (!data || data.length < PAGE_SIZE) break;
        }
        if (active) setWishes(all);
      } catch (error) {
        console.error("Unable to load owner wishes.", error);
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [access, refresh]);

  const counts = useMemo(
    () => ({
      all: wishes.length,
      active: wishes.filter((wish) => wish.deleted_at === null).length,
      deleted: wishes.filter((wish) => wish.deleted_at !== null).length,
    }),
    [wishes],
  );

  const filteredWishes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return wishes
      .filter(
        (wish) =>
          !query ||
          wish.guest_name.toLocaleLowerCase().includes(query) ||
          wish.message.toLocaleLowerCase().includes(query),
      )
      .sort((a, b) => {
        const direction = sortOrder === "newest" ? -1 : 1;
        return (
          direction * a.created_at.localeCompare(b.created_at) ||
          direction * a.id.localeCompare(b.id)
        );
      });
  }, [search, sortOrder, wishes]);

  const saveEdit = async (event: FormEvent<HTMLFormElement>, wish: Wish) => {
    event.preventDefault();
    const guestName = editName.trim();
    const message = editMessage.trim();
    if (!guestName || guestName.length > 60 || !message || message.length > 1000) {
      setActionError("Enter a name and message within the character limits.");
      return;
    }
    setNotice(null);
    setActionError(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("The wishes database is not configured.");
      const { data, error } = await supabase
        .from("wishes")
        .update({ guest_name: guestName, message })
        .eq("id", wish.id)
        .select("id, author_id, guest_name, message, created_at, updated_at, deleted_at")
        .single();
      if (error) throw error;
      setWishes((current) => current.map((item) => (item.id === wish.id ? data : item)));
      setEditId(null);
      setNotice("Wish or prayer updated.");
    } catch (error) {
      console.error("Unable to edit a wedding wish.", error);
      setActionError("We could not save this wish. Please try again.");
    }
  };

  const setDeleted = async (wish: Wish) => {
    const deleting = wish.deleted_at === null;
    if (
      deleting &&
      !window.confirm("Delete this wish or prayer? It will no longer appear publicly.")
    ) {
      return;
    }
    setNotice(null);
    setActionError(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("The wishes database is not configured.");
      const { data, error } = await supabase
        .from("wishes")
        .update({ deleted_at: deleting ? new Date().toISOString() : null })
        .eq("id", wish.id)
        .select("id, author_id, guest_name, message, created_at, updated_at, deleted_at")
        .single();
      if (error) throw error;
      setWishes((current) => current.map((item) => (item.id === wish.id ? data : item)));
      setEditId(null);
      setNotice(deleting ? "Wish or prayer deleted." : "Wish or prayer restored.");
    } catch (error) {
      console.error("Unable to update a wedding wish.", error);
      setActionError("We could not update this wish. Please try again.");
    }
  };

  const signOut = async () => {
    setActionError(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("The wishes database is not configured.");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Unable to sign out of the wishes owner area.", error);
      setActionError("We could not sign you out. Please try again.");
    }
  };

  if (auth.loading || access === "checking") {
    return (
      <main className="owner-wishes-page" aria-busy="true">
        <p role="status">Checking owner access…</p>
      </main>
    );
  }
  if (access === "unconfigured") {
    return (
      <main className="owner-wishes-page">
        <h1>Owner Control</h1>
        <p>Supabase authentication is not configured.</p>
      </main>
    );
  }
  if (access === "error") {
    return (
      <main className="owner-wishes-page">
        <h1>Owner Control</h1>
        <p role="alert">We could not verify owner access. Please try again later.</p>
      </main>
    );
  }
  if (access === "unauthorized" && !auth.user) {
    return (
      <main className="owner-wishes-page">
        <Link className="owner-back-link" href="/">
          ← Back to the invitation
        </Link>
        <h1>Owner Control</h1>
        <p>Sign in with an authorized wedding owner email address.</p>
        <WishOwnerLogin
          redirectPath="/owner/wishes/"
          intro="Sign in with an authorized wedding owner account. Use your password or request a secure email link."
        />
      </main>
    );
  }
  if (access === "unauthorized") {
    return (
      <main className="owner-wishes-page">
        <Link className="owner-back-link" href="/">
          ← Back to the invitation
        </Link>
        <h1>Owner Control</h1>
        <p role="alert">This signed-in account is not authorized to manage wishes.</p>
        <button className="btn mt-4" type="button" onClick={() => void signOut()}>
          Sign out and use another account
        </button>
        {actionError ? (
          <p className="form-error mt-3" role="alert">
            {actionError}
          </p>
        ) : null}
      </main>
    );
  }

  return (
    <main className="owner-wishes-page">
      <header className="owner-wishes-header">
        <div>
          <Link className="owner-back-link" href="/">
            ← Back to the invitation
          </Link>
          <p className="label eyebrow">Protected owner area</p>
          <h1>Owner Control</h1>
          <p className="muted">Signed in as {auth.user?.email}</p>
        </div>
        <button className="btn" type="button" onClick={() => void signOut()}>
          Sign out
        </button>
      </header>

      <WishPasswordSettings />

      <section className="owner-wishes-counts" aria-label="Message counts">
        {(
          [
            ["Total messages", counts.all],
            ["Visible publicly", counts.active],
            ["Deleted", counts.deleted],
          ] as const
        ).map(([label, value]) => (
          <article className="owner-count-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section aria-label="Find wishes">
        <div className="owner-wishes-filters">
          <label>
            Search by name or message
            <input
              className="field"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            Sort
            <select
              className="field"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value === "oldest" ? "oldest" : "newest")
              }
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </section>

      {notice ? (
        <p className="form-success mt-5" role="status">
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p className="form-error mt-5" role="alert">
          {actionError}
        </p>
      ) : null}
      {loading ? <p role="status">Loading wishes…</p> : null}
      {loadError ? (
        <div role="alert">
          <p>Wishes could not be loaded.</p>
          <button className="btn" type="button" onClick={() => setRefresh((value) => value + 1)}>
            Try again
          </button>
        </div>
      ) : null}
      {!loading && !loadError && filteredWishes.length === 0 ? (
        <p className="muted mt-6">No wishes or prayers found.</p>
      ) : null}

      <ul className="owner-wish-list">
        {filteredWishes.map((wish) => (
          <li className="owner-wish-card" key={wish.id}>
            <div className="owner-wish-heading">
              <div>
                <h2>{wish.guest_name}</h2>
                <p>{wish.deleted_at ? "Deleted" : "Visible publicly"}</p>
              </div>
            </div>
            {editId === wish.id ? (
              <form
                className="wish-edit-form mt-5"
                onSubmit={(event) => void saveEdit(event, wish)}
              >
                <label>
                  Guest name
                  <input
                    className="field"
                    maxLength={60}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Wish or prayer
                  <textarea
                    className="field"
                    maxLength={1000}
                    rows={5}
                    value={editMessage}
                    onChange={(event) => setEditMessage(event.target.value)}
                    required
                  />
                </label>
                <div className="wish-card-actions">
                  <button className="btn btn-solid" type="submit">
                    Save changes
                  </button>
                  <button className="btn" type="button" onClick={() => setEditId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="owner-wish-message">{wish.message}</p>
                <div className="owner-wish-dates">
                  <p>Submitted on {formatDate(wish.created_at)}</p>
                  {wish.updated_at !== wish.created_at ? (
                    <p>Updated on {formatDate(wish.updated_at)}</p>
                  ) : null}
                  {wish.deleted_at ? <p>Deleted on {formatDate(wish.deleted_at)}</p> : null}
                </div>
                <div className="wish-card-actions">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setEditId(wish.id);
                      setEditName(wish.guest_name);
                      setEditMessage(wish.message);
                      setActionError(null);
                      setNotice(null);
                    }}
                  >
                    Edit message
                  </button>
                  <button className="btn" type="button" onClick={() => void setDeleted(wish)}>
                    {wish.deleted_at ? "Restore message" : "Delete message"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
