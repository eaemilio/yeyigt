import { Profile } from '@prisma/client';
import { createContext } from 'react';

export type User = {
  id: number;
  email: string;
};

export type SessionContextType =
  | {
      session: {
        userMeta: Profile;
        user?: User;
        access_token?: string;
      };
    }
  | { session: null };

export const SessionContext = createContext<SessionContextType>({ session: null });
