import { assign, setup } from 'xstate';
import type { ClientError } from './error.types';

type ErrorContext = {
  notifications: ClientError[];
};

type ErrorEvent =
  | { type: 'PUSH_ERROR'; error: ClientError }
  | { type: 'DISMISS'; id: string }
  | { type: 'DISMISS_ALL' };

/**
 * Global error state machine.
 *
 * Manages application-wide error notifications independently
 * from feature-scoped machines (e.g., authMachine).
 *
 * States:
 * - idle: No active notifications.
 * - active: One or more notifications are displayed.
 *
 * Auto-transitions back to idle when the queue empties.
 */
export const errorMachine = setup({
  types: {
    context: {} as ErrorContext,
    events: {} as ErrorEvent,
  },
}).createMachine({
  id: 'globalError',
  initial: 'idle',
  context: { notifications: [] },
  states: {
    idle: {
      on: {
        PUSH_ERROR: {
          target: 'active',
          actions: assign({
            notifications: ({ context, event }) => [
              ...context.notifications,
              event.error,
            ],
          }),
        },
      },
    },
    active: {
      on: {
        PUSH_ERROR: {
          actions: assign({
            notifications: ({ context, event }) => [
              ...context.notifications,
              event.error,
            ],
          }),
        },
        DISMISS: {
          actions: assign({
            notifications: ({ context, event }) =>
              context.notifications.filter((n) => n.id !== event.id),
          }),
        },
        DISMISS_ALL: {
          target: 'idle',
          actions: assign({ notifications: [] }),
        },
      },
      always: {
        guard: ({ context }) => context.notifications.length === 0,
        target: 'idle',
      },
    },
  },
});
