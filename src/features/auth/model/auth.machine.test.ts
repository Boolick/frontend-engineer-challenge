import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createActor } from 'xstate';
import { authMachine } from './auth.machine';

describe('authMachine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should transition from idle to submitting on SUBMIT event', () => {
    const actor = createActor(authMachine).start();
    expect(actor.getSnapshot().value).toBe('idle');

    actor.send({ type: 'SUBMIT' });
    expect(actor.getSnapshot().value).toBe('submitting');
  });

  it('should transition to authenticated on SUCCESS event', () => {
    const actor = createActor(authMachine).start();
    actor.send({ type: 'SUBMIT' });
    
    const user = { id: '1', email: 'test@example.com', createdAt: new Date().toISOString() };
    actor.send({ type: 'SUCCESS', user });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('authenticated');
    expect(snapshot.context.user).toEqual(user);
    expect(snapshot.context.error).toBeNull();
  });

  it('should return to idle on FAILURE event', () => {
    const actor = createActor(authMachine).start();
    actor.send({ type: 'SUBMIT' });
    actor.send({ type: 'FAILURE', error: 'Invalid credentials' });
    
    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('idle');
    expect(snapshot.context.error).toBe('Invalid credentials');
  });

  it('should transition to rateLimited and handle countdown timer correctly', () => {
    const actor = createActor(authMachine).start();
    actor.send({ type: 'SUBMIT' });
    actor.send({ type: 'RATE_LIMITED', retryAfter: 3 });

    let snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('rateLimited');
    expect(snapshot.context.retryAfter).toBe(3);
    
    // Advance timer by 1 second
    vi.advanceTimersByTime(1000);
    snapshot = actor.getSnapshot();
    expect(snapshot.context.retryAfter).toBe(2);

    // Advance timer by another second
    vi.advanceTimersByTime(1000);
    snapshot = actor.getSnapshot();
    expect(snapshot.context.retryAfter).toBe(1);

    // Advance timer one last time, should return to idle
    vi.advanceTimersByTime(1000);
    snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('idle');
    expect(snapshot.context.error).toBeNull();
    expect(snapshot.context.retryAfter).toBeNull();
  });

  it('should transition to idle and clear context on LOGOUT', () => {
    const actor = createActor(authMachine).start();
    actor.send({ type: 'SUBMIT' });
    
    const user = { id: '1', email: 'test@example.com', createdAt: new Date().toISOString() };
    actor.send({ type: 'SUCCESS', user });
    expect(actor.getSnapshot().value).toBe('authenticated');

    actor.send({ type: 'LOGOUT' });
    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('idle');
    expect(snapshot.context.user).toBeNull();
  });
});
