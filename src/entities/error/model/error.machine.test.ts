import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { errorMachine } from '@/entities/error/model/error.machine';
import { createClientError } from '@/entities/error/model/error.types';

describe('errorMachine', () => {
  it('should start in idle state with no notifications', () => {
    const actor = createActor(errorMachine).start();
    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('idle');
    expect(snapshot.context.notifications).toHaveLength(0);
  });

  it('should transition to active and add notification on PUSH_ERROR', () => {
    const actor = createActor(errorMachine).start();
    const error = createClientError('invalid_credentials', 'Test error');

    actor.send({ type: 'PUSH_ERROR', error });

    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('active');
    expect(snapshot.context.notifications).toHaveLength(1);
    expect(snapshot.context.notifications[0]).toEqual(error);
  });

  it('should allow multiple notifications', () => {
    const actor = createActor(errorMachine).start();
    
    actor.send({ 
      type: 'PUSH_ERROR', 
      error: createClientError('validation_error', 'Error 1') 
    });
    actor.send({ 
      type: 'PUSH_ERROR', 
      error: createClientError('rate_limited', 'Error 2') 
    });

    const snapshot = actor.getSnapshot();
    expect(snapshot.context.notifications).toHaveLength(2);
    expect(snapshot.context.notifications[0].message).toBe('Error 1');
    expect(snapshot.context.notifications[1].message).toBe('Error 2');
  });

  it('should dismiss a specific notification by id', () => {
    const actor = createActor(errorMachine).start();
    const err1 = createClientError('unknown_error', 'Err 1');
    const err2 = createClientError('unknown_error', 'Err 2');

    actor.send({ type: 'PUSH_ERROR', error: err1 });
    actor.send({ type: 'PUSH_ERROR', error: err2 });

    actor.send({ type: 'DISMISS', id: err1.id });

    const snapshot = actor.getSnapshot();
    expect(snapshot.context.notifications).toHaveLength(1);
    expect(snapshot.context.notifications[0].id).toBe(err2.id);
  });

  it('should transition back to idle when all notifications are dismissed', () => {
    const actor = createActor(errorMachine).start();
    const error = createClientError('backend_unavailable');

    actor.send({ type: 'PUSH_ERROR', error });
    expect(actor.getSnapshot().value).toBe('active');

    actor.send({ type: 'DISMISS', id: error.id });

    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('idle');
    expect(snapshot.context.notifications).toHaveLength(0);
  });

  it('should clear everything on DISMISS_ALL', () => {
    const actor = createActor(errorMachine).start();
    
    actor.send({ type: 'PUSH_ERROR', error: createClientError('unknown_error') });
    actor.send({ type: 'PUSH_ERROR', error: createClientError('unknown_error') });

    actor.send({ type: 'DISMISS_ALL' });

    const snapshot = actor.getSnapshot();
    expect(snapshot.value).toBe('idle');
    expect(snapshot.context.notifications).toHaveLength(0);
  });
});
