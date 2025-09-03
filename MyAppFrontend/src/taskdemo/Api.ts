// api/todo.ts
export type TodoItem = {
  id: number;
  title: string;
  isDone: boolean;
};

/** Basic fetch wrapper with good errors */
async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/todo${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });

  if (!res.ok) {
    // Try to surface server-provided JSON or text
    let detail: unknown;
    try {
      const ct = res.headers.get('content-type') ?? '';
      detail = ct.includes('application/json') ? await res.json() : await res.text();
    } catch {
      /* ignore */
    }
    const err = new Error(
      `HTTP ${res.status} ${res.statusText} for ${path}${
        detail ? ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''
      }`,
    );
    // @ts-expect-error attach for callers that want to inspect
    err.status = res.status;
    // @ts-expect-error body for callers that want to inspect
    err.body = detail;
    throw err;
  }

  // 204 (No Content) will throw on .json(); handle explicitly
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Queries */
export function listTodos(opts?: { signal?: AbortSignal }) {
  return http<TodoItem[]>('', { method: 'GET', signal: opts?.signal });
}

export function getTodo(id: number, opts?: { signal?: AbortSignal }) {
  return http<TodoItem>(`/${id}`, { method: 'GET', signal: opts?.signal });
}

/** Mutations */
export type NewTodo = Omit<TodoItem, 'id'>; // server ignores client Id anyway

export function createTodo(input: NewTodo) {
  return http<TodoItem>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteTodo(id: number) {
  return http<void>(`/${id}`, { method: 'DELETE' });
}

/** React Query helpers */
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...todoKeys.lists(), { filters }] as const,
  detail: () => [...todoKeys.all, 'detail'] as const,
  detailById: (id: number) => [...todoKeys.detail(), id] as const,
};
