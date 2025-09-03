// pages/TodosPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { createTodo, deleteTodo, listTodos, todoKeys, type NewTodo, type TodoItem } from './Api';

export default function TodosPage() {
  const qc = useQueryClient();

  // ---- Queries ----
  const todosQuery = useQuery({
    queryKey: todoKeys.list(),
    queryFn: ({ signal }) => listTodos({ signal }),
    staleTime: 10_000,
  });

  // ---- Mutations ----
  const createMutation = useMutation({
    mutationFn: (input: NewTodo) => createTodo(input),
    // Optimistic create
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: todoKeys.lists() });
      const prev = qc.getQueryData<TodoItem[]>(todoKeys.list());

      const optimistic: TodoItem = {
        id: Math.floor(Math.random() * -1_000_000), // temp negative id
        title: input.title,
        isDone: input.isDone,
      };

      qc.setQueryData<TodoItem[]>(todoKeys.list(), (old) =>
        old ? [optimistic, ...old] : [optimistic],
      );

      return { prev };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.prev) qc.setQueryData(todoKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    // Optimistic delete
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: todoKeys.lists() });
      const prev = qc.getQueryData<TodoItem[]>(todoKeys.list());

      qc.setQueryData<TodoItem[]>(todoKeys.list(), (old) =>
        old ? old.filter((t) => t.id !== id) : old,
      );

      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(todoKeys.list(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  // ---- Form state ----
  const [title, setTitle] = React.useState('');
  const [isDone, setIsDone] = React.useState(false);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({ title: title.trim(), isDone });
    setTitle('');
    setIsDone(false);
  };

  // ---- UI ----
  if (todosQuery.isLoading) return <p>Loading…</p>;
  if (todosQuery.isError) return <p>Oops: {(todosQuery.error as Error).message}</p>;

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Todos</h1>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="New todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={isDone} onChange={(e) => setIsDone(e.target.checked)} />
          Done?
        </label>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Adding…' : 'Add'}
        </button>
      </form>

      {todosQuery.data?.length ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {todosQuery.data.map((t) => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <span aria-hidden>{t.isDone ? '✅' : '⬜️'}</span>
              <span style={{ flex: 1 }}>{t.title}</span>
              <button
                onClick={() => deleteMutation.mutate(t.id)}
                disabled={deleteMutation.isPending}
                title="Delete"
              >
                {deleteMutation.isPending ? '…' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos yet. Add one above!</p>
      )}
    </div>
  );
}
