// Simple store for MVP (can be replaced with Pinia later)
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({
        response: null,
        currentRequest: { url: '', method: 'GET', headers: '', body: '' },
        loading: false,
        error: '',
        history: []
    }),
    actions: {
        setRequest(request) {
            this.currentRequest = { ...request };
        },
        setResponse(response) {
            this.response = response;
        },
        setLoading(val) {
            this.loading = val;
        },
        setError(msg) {
            this.error = msg;
        },
        setHistory(history) {
            this.history = history;
        }
    }
});
