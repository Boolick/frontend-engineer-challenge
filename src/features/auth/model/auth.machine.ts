import { setup, assign, fromCallback } from "xstate";
import { User } from "@/entities/session/model/types";

export type AuthContext = {
  user: User | null;
  error: string | null;
  retryAfter: number | null;
};

export type AuthEvent =
  | { type: "SUBMIT" }
  | { type: "SUCCESS"; user: User }
  | { type: "FAILURE"; error: string }
  | { type: "RATE_LIMITED"; retryAfter: number }
  | { type: "TICK" }
  | { type: "RESET" }
  | { type: "LOGOUT" };

export const authMachine = setup({
  types: {
    context: {} as AuthContext,
    events: {} as AuthEvent,
  },
  actors: {
    // В v5 используем fromCallback для интервалов и таймеров
    timerActor: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: "TICK" });
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
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgJYQBswBiAZQFUAhAWQEkAVAbQAYBdRUABwHtZd1c3AHYcQAD0QAOAMwBObADYALDIWzpkgKxKAjACZJAGhABPKTuxLZ12Qr06A7HqVLN0gL7vjaLNlioAIwBbfgEhKDJyAGEogFFSUhZ2JBAePgFhUQkETQUHRWYdNwNmSUk9TWMzBGk1bAcrWUkFSVknJT0HT28MHH9g0Nxw4gAxAEFaABlyACVYpNE0-kERFOzc-IVC4slS8srTRD0KxWdrIs122r1ukB8+wJD0MIiZsfpYgH1J2joPgBEFiklhlVqBsno6scFJoDNJmMwHPD1FVENJNJJsJIGk09G1JEppLpbvdsAAnZDoMCTXBPSDEei0KIAaSBXF4y0yayOmgsznsDQchWkkKcqJyOmkWJx5T00najhJvXJlOptP49MZLMYOmS7PSKyyiA64pUClOVhk6isDSUSt8FKpNLpEGIc1IsSYbEWHNBRoQFT5HUcSiFktFenFCh0Fn0Nrxjjl1ntOHuYCEAgAxqrXZMAPIAcTz5C9etSvsN3IQVsUKlq6i0ugM4vr9UazVa7U6ni8ICE3AgcFE9x9Bq54MQAFoFOLpym8IQwKPOWDxIgmlKdIVQ2pZbJeS3bNg421CdY7EoFPP+k8Xsu-VWOkpsBiMfu8Ri8kZDjVym3rEKKilDoWyaPOjpqi696VhOCAuIoyjMDCuiyHKSE6OKGKYtiNqXjo8Zgb2pJphmuDZlSEDQeOa4IGoFgKCKDiaJcmilLIhKHlKF6nnItjOFePZAA */
  id: "auth",
  initial: "idle",
  context: {
    user: null,
    error: null,
    retryAfter: null,
  },
  states: {
    idle: {
      on: {
        SUBMIT: { target: "submitting", actions: "clearError" },
      },
    },
    submitting: {
      on: {
        SUCCESS: {
          target: "authenticated",
          actions: assign({
            user: ({ event }) => event.user,
            error: null,
          }),
        },
        FAILURE: {
          target: "idle",
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
        RATE_LIMITED: {
          target: "rateLimited",
          actions: assign({
            retryAfter: ({ event }) => event.retryAfter,
            error: "Слишком много попыток. Пожалуйста, подождите.",
          }),
        },
      },
    },
    rateLimited: {
      invoke: {
        src: "timerActor",
      },
      on: {
        TICK: [
          // 1. Если таймер дошел до 1 (или меньше) -> сбрасываем и идем в idle
          {
            guard: ({ context }) => (context.retryAfter ?? 0) <= 1,
            target: "idle",
            actions: "clearError",
          },
          // 2. Иначе -> просто уменьшаем таймер (внутренний переход, target не указан)
          {
            actions: "decrementTimer",
          },
        ],
        RESET: {
          target: "idle",
          actions: "clearError",
        },
      },
    },
    authenticated: {
      on: {
        LOGOUT: {
          target: "idle",
          actions: assign({
            user: null,
          }),
        },
      },
    },
  },
});

