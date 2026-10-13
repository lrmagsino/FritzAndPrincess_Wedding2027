"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { getSupabaseClient, type Wish } from "@/lib/supabase";
import { getWishOwnershipToken, removeWishOwnershipToken } from "@/lib/wishOwnership";
import { useWishAuth } from "./WishAuth";

type LoadState = "loading" | "ready" | "error" | "unconfigured";
type WishCursor = Pick<Wish, "id" | "created_at">;
const PAGE_SIZE = 24;

function isWish(value: unknown): value is Wish {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    (typeof row.author_id === "string" || row.author_id === null) &&
    typeof row.guest_name === "string" &&
    typeof row.message === "string" &&
    typeof row.created_at === "string" &&
    typeof row.updated_at === "string" &&
    (typeof row.deleted_at === "string" || row.deleted_at === null)
  );
}

function mergeWishes(current: Wish[], incoming: Wish[]) {
  const byId = new Map(current.map((wish) => [wish.id, wish]));
  for (const wish of incoming) {
    if (wish.deleted_at) byId.delete(wish.id);
    else byId.set(wish.id, wish);
  }
  return [...byId.values()].sort(
    (a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id),
  );
}

function formatWishDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

export function WishesList() {
  const auth = useWishAuth();
  const [state, setState] = useState<LoadState>("loading");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [ownershipTokens, setOwnershipTokens] = useState<Record<string, string>>({});
  const [ownershipStorageError, setOwnershipStorageError] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    const refreshForNewWish = () => setAttempt((current) => current + 1);
    window.addEventListener("wedding-wish-submitted", refreshForNewWish);

    void (async () => {
      await Promise.resolve();
      let supabase;
      try {
        supabase = getSupabaseClient();
      } catch (error) {
        console.error("Unable to initialize the wishes database.", error);
        if (active) setState("error");
        return;
      }

      if (!supabase) {
        if (active) setState("unconfigured");
        return;
      }

      setState("loading");
      const channel = supabase
        .channel(`public-wishes-${crypto.randomUUID()}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "wishes" }, (payload) => {
          if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            if (typeof deletedId === "string") {
              setWishes((current) => current.filter((wish) => wish.id !== deletedId));
            }
            return;
          }
          const wish = payload.new;
          if (!isWish(wish)) return;
          setWishes((current) => mergeWishes(current, [wish]));
        })
        .subscribe((status, error) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.error("Unable to receive live wedding wishes.", error);
          }
        });
      unsubscribe = () => {
        void channel.unsubscribe();
      };

      if (!active) {
        unsubscribe();
        return;
      }

      try {
        const { data, error } = await supabase
          .from("wishes")
          .select("id, author_id, guest_name, message, created_at, updated_at, deleted_at")
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .limit(PAGE_SIZE);

        if (!active) return;
        if (error) {
          console.error("Unable to load wedding wishes.", error);
          setState("error");
          return;
        }

        setWishes((current) => mergeWishes(current, data ?? []));
        const tokens: Record<string, string> = {};
        try {
          for (const wish of data ?? []) {
            const token = getWishOwnershipToken(wish.id);
            if (token) tokens[wish.id] = token;
          }
          if (active) setOwnershipTokens((current) => ({ ...current, ...tokens }));
        } catch (error) {
          console.error("Unable to read private wish management access from this browser.", error);
          if (active) setOwnershipStorageError(true);
        }
        setHasMore(data?.length === PAGE_SIZE);
        setState("ready");
      } catch (error) {
        console.error("Unable to load wedding wishes.", error);
        if (active) setState("error");
      }
    })();

    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("wedding-wish-submitted", refreshForNewWish);
    };
  }, [attempt, auth.user?.id]);

  const loadMore = useCallback(async () => {
    const cursor: WishCursor | undefined = wishes.at(-1);
    if (!hasMore || !cursor || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setPageError(false);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("The wishes database is no longer configured.");
      const { data, error } = await supabase
        .from("wishes")
        .select("id, author_id, guest_name, message, created_at, updated_at, deleted_at")
        .is("deleted_at", null)
        .or(
          `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`,
        )
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(PAGE_SIZE);

      if (error) throw error;
      setWishes((current) => mergeWishes(current, data ?? []));
      try {
        const tokens: Record<string, string> = {};
        for (const wish of data ?? []) {
          const token = getWishOwnershipToken(wish.id);
          if (token) tokens[wish.id] = token;
        }
        setOwnershipTokens((current) => ({ ...current, ...tokens }));
      } catch (error) {
        console.error("Unable to read private wish management access from this browser.", error);
        setOwnershipStorageError(true);
      }
      setHasMore(data?.length === PAGE_SIZE);
    } catch (error) {
      console.error("Unable to load more wedding wishes.", error);
      setPageError(true);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, wishes]);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || state !== "ready" || !hasMore || pageError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { root, rootMargin: "120px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore, pageError, state]);

  const saveEdit = async (wish: Wish) => {
    const guestName = editName.trim();
    const message = editMessage.trim();
    if (!guestName || guestName.length > 60 || !message || message.length > 1000) {
      setActionError("Enter a name and message within the character limits.");
      return;
    }
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setActionError(null);
    setActionMessage(null);
    try {
      const token = ownershipTokens[wish.id];
      if (token) {
        const { data, error } = await supabase.rpc("manage_wish_by_token", {
          p_wish_id: wish.id,
          p_author_token: token,
          p_guest_name: guestName,
          p_message: message,
          p_delete: false,
        });
        if (error) throw error;
        if (!data) throw new Error("The wishes service did not update this message.");
        setWishes((current) =>
          current.map((item) =>
            item.id === wish.id
              ? { ...item, guest_name: guestName, message, updated_at: new Date().toISOString() }
              : item,
          ),
        );
      } else {
        const { data, error } = await supabase
          .from("wishes")
          .update({ guest_name: guestName, message })
          .eq("id", wish.id)
          .select("id, author_id, guest_name, message, created_at, updated_at, deleted_at")
          .single();
        if (error) throw error;
        setWishes((current) => mergeWishes(current, [data]));
      }
      setEditId(null);
      setActionMessage("Your wish or prayer has been updated.");
    } catch (error) {
      console.error("Unable to edit your wedding wish.", error);
      setActionError("We could not save your changes. Please try again.");
    }
  };

  const deleteWish = async (wish: Wish) => {
    if (!window.confirm("Delete your wish or prayer? It will no longer appear publicly.")) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setActionError(null);
    setActionMessage(null);
    try {
      const token = ownershipTokens[wish.id];
      if (token) {
        const { data, error } = await supabase.rpc("manage_wish_by_token", {
          p_wish_id: wish.id,
          p_author_token: token,
          p_guest_name: wish.guest_name,
          p_message: wish.message,
          p_delete: true,
        });
        if (error) throw error;
        if (!data) throw new Error("The wishes service did not delete this message.");
      } else {
        const { error } = await supabase
          .from("wishes")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", wish.id);
        if (error) throw error;
      }
      if (token) {
        try {
          removeWishOwnershipToken(wish.id);
        } catch (storageError) {
          console.error("Unable to clear deleted wish ownership access.", storageError);
        }
        setOwnershipTokens((current) => {
          const next = { ...current };
          delete next[wish.id];
          return next;
        });
      }
      setWishes((current) => current.filter((item) => item.id !== wish.id));
      setEditId(null);
      setActionMessage("Your wish or prayer was deleted.");
    } catch (error) {
      console.error("Unable to delete your wedding wish.", error);
      setActionError("We could not delete your wish. Please try again.");
    }
  };

  return (
    <div className="wishes-list" aria-labelledby="wishes-wall-title">
      <h3 id="wishes-wall-title" className="display text-3xl">
        Wishes for the couple
      </h3>
      <p className="form-hint mt-2">New wishes appear here immediately.</p>
      {actionMessage ? (
        <p className="form-success mt-4" role="status">
          {actionMessage}
        </p>
      ) : null}
      {actionError ? (
        <p className="form-error mt-4" role="alert">
          {actionError}
        </p>
      ) : null}
      {ownershipStorageError ? (
        <p className="form-error mt-4" role="alert">
          This browser could not read saved wish ownership access. Allow local storage to manage
          wishes submitted from this browser.
        </p>
      ) : null}
      {state === "loading" ? (
        <p className="muted mt-5" role="status">
          Gathering wishes…
        </p>
      ) : null}
      {state === "unconfigured" || !auth.configured ? (
        <p className="muted mt-5" role="status">
          Wishes and prayers will appear here once the couple’s database is connected.
        </p>
      ) : null}
      {state === "error" ? (
        <div className="mt-5" role="alert">
          <p>Wishes are not available right now. Please try again later.</p>
          <button
            type="button"
            className="btn mt-4"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      ) : null}
      {state === "ready" && wishes.length === 0 ? (
        <p className="muted mt-5" role="status">
          Be the first to leave a wish or prayer for Fritz &amp; Princess.
        </p>
      ) : null}
      {state === "ready" && wishes.length > 0 ? (
        <div
          ref={scrollRef}
          className="wishes-scroll-wheel mt-6"
          role="region"
          aria-label="Wishes and prayers for Fritz and Princess"
          tabIndex={0}
        >
          <ul className="wishes-wheel-list">
            {wishes.map((wish) => {
              const isAuthor = Boolean(
                ownershipTokens[wish.id] || (auth.user && wish.author_id === auth.user.id),
              );
              return (
                <li key={wish.id}>
                  <article className="card wishes-wheel-card">
                    {editId === wish.id ? (
                      <form
                        className="wish-edit-form"
                        onSubmit={(event: FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          void saveEdit(wish);
                        }}
                      >
                        <label>
                          Your name
                          <input
                            className="field"
                            maxLength={60}
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Your wish or prayer
                          <textarea
                            className="field"
                            maxLength={1000}
                            rows={4}
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
                        <h4 className="font-medium">{wish.guest_name}</h4>
                        <p className="mt-3 whitespace-pre-wrap">{wish.message}</p>
                        <p className="form-hint mt-4">
                          Submitted on {formatWishDate(wish.created_at)}
                        </p>
                        {isAuthor && wish.updated_at !== wish.created_at ? (
                          <p className="form-hint">Updated on {formatWishDate(wish.updated_at)}</p>
                        ) : null}
                        {isAuthor ? (
                          <div className="wish-card-actions">
                            <button
                              className="btn"
                              type="button"
                              onClick={() => {
                                setEditId(wish.id);
                                setEditName(wish.guest_name);
                                setEditMessage(wish.message);
                                setActionError(null);
                                setActionMessage(null);
                              }}
                            >
                              Edit your wish
                            </button>
                            <button
                              className="btn"
                              type="button"
                              onClick={() => void deleteWish(wish)}
                            >
                              Delete your wish
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </article>
                </li>
              );
            })}
            {hasMore ? (
              <li ref={sentinelRef} className="wishes-wheel-sentinel">
                {loadingMore ? <span role="status">Loading more wishes…</span> : null}
                {pageError ? (
                  <button className="btn" type="button" onClick={() => void loadMore()}>
                    Load more wishes
                  </button>
                ) : null}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
