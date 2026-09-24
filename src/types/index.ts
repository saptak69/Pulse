export interface Hobby {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
}

export interface Entry {
  id: string;
  hobbyId: string;
  date: string; // YYYY-MM-DD format
  note?: string;
  quantity?: number;
  createdAt: number;
}
