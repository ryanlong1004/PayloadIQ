import { describe, it, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMainStore } from '../index';

describe('MainStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('sets request and response', () => {
        const store = useMainStore();
        const req = { url: 'https://api', method: 'GET', headers: '', body: '' };
        store.setRequest(req);
        expect(store.currentRequest).toEqual(req);
        const res = { body: 'ok', status: 200 };
        store.setResponse(res);
        expect(store.response).toEqual(res);
    });

    it('handles error and loading', () => {
        const store = useMainStore();
        store.setError('fail');
        expect(store.error).toBe('fail');
        store.setLoading(true);
        expect(store.loading).toBe(true);
    });
});
