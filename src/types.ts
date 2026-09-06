export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: { base64: string; mimeType: string }[];
  createdAt: number;
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}
