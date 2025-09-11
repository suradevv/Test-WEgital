export type Todo = {
  id: string;
  title: string;
  detail?: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Filter = 'all' | 'active' | 'done';
