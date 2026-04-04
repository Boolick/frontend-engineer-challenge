import { assign, fromCallback, setup } from 'xstate';
import { User } from '@/entities/session/model/types';

export type AuthContext = {
  user: User | null;
  error: string | null;
  retryAfter: number | null;
};

export type AuthEvent =
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; user: User }
  | { type: 'FAILURE'; error: string }
  | { type: 'RATE_LIMITED'; retryAfter: number }
  | { type: 'TICK' }
  | { type: 'RESET' }
  | { type: 'LOGOUT' };

export const authMachine = setup({
  types: {
    context: {} as AuthContext,
    events: {} as AuthEvent,
  },
  actors: {
    timerActor: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: 'TICK' });
      }, 1000);

      return () => clearInterval(interval);
    }),
  },
  actions: {
    clearError: assign({
      error: null,
      retryAfter: null,
    }),
    decrementTimer: assign({
      retryAfter: ({ context }) =>
        context.retryAfter ? context.retryAfter - 1 : 0,
    }),
  },
}).createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    user: null,
    error: null,
    retryAfter: null,
  },
  states: {
    idle: {
      on: {
        SUBMIT: { target: 'submitting', actions: 'clearError' },
      },
    },
    submitting: {
      on: {
        SUCCESS: {
          target: 'authenticated',
          actions: assign({
            user: ({ event }) => event.user,
            error: null,
          }),
        },
        FAILURE: {
          target: 'idle',
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
        RATE_LIMITED: {
          target: 'rateLimited',
          actions: assign({
            retryAfter: ({ event }) => event.retryAfter,
            error: 'rate_limited',
          }),
        },
      },
    },
    rateLimited: {
      invoke: {
        src: 'timerActor',
      },
      on: {
        TICK: [
          {
            guard: ({ context }) => (context.retryAfter ?? 0) <= 1,
            target: 'idle',
            actions: 'clearError',
          },
          {
            actions: 'decrementTimer',
          },
        ],
        RESET: {
          target: 'idle',
          actions: 'clearError',
        },
      },
    },
    authenticated: {
      on: {
        LOGOUT: {
          target: 'idle',
          actions: assign({
            user: null,
          }),
        },
      },
    },
  },
});
