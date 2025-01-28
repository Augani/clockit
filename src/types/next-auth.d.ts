import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string; // Add role here
  }

  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id: string;
    role: string;
  }
}
