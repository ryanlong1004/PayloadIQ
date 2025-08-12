// Simple store for MVP (can be replaced with Pinia later)
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({
        response: null,
        currentRequest: { url: '', method: 'GET', headers: '', body: '' },
        loading: false,
        error: '',
        history: [],
        environments: [
            {
                id: 'default',
                name: 'Default',
                variables: {},
                secrets: [] // array of variable keys that are secrets
            }
        ],
        activeEnvironmentId: 'default'
    }),
    actions: {
        setRequest(request) {
            this.currentRequest = { ...request };
            // Auto-save current request to localStorage for recovery
            localStorage.setItem('unsaved_request', JSON.stringify(this.currentRequest));
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
            // Limit history to last 100 requests
            this.history = history.slice(0, 100);
        },
        setCollections(collections) {
            this.collections = collections;
        },
        addCollection(collection) {
            if (!this.collections) this.collections = [];
            this.collections.push(collection);
        },
        removeCollection(id) {
            this.collections = this.collections.filter(c => c.id !== id);
        },
        setActiveCollection(id) {
            this.activeCollectionId = id;
        },
        recoverUnsavedRequest() {
            const saved = localStorage.getItem('unsaved_request');
            if (saved) {
                this.currentRequest = JSON.parse(saved);
            }
        },
        // Add request to history with size limit
        addToHistory(item) {
            this.history.unshift(item);
            if (this.history.length > 100) this.history.length = 100;
        },
        addEnvironment(env) {
            this.environments.push(env);
        },
        updateEnvironment(id, updates) {
            const idx = this.environments.findIndex(e => e.id === id);
            if (idx !== -1) {
                this.environments[idx] = { ...this.environments[idx], ...updates };
            }
        },
        removeEnvironment(id) {
            this.environments = this.environments.filter(e => e.id !== id);
            if (this.activeEnvironmentId === id) {
                this.activeEnvironmentId = this.environments[0]?.id || '';
            }
        },
        setActiveEnvironment(id) {
            this.activeEnvironmentId = id;
        },
        // Variable CRUD
        addVariable(envId, key, value, isSecret = false) {
            const env = this.environments.find(e => e.id === envId);
            if (env) {
                env.variables[key] = value;
                if (isSecret && !env.secrets.includes(key)) env.secrets.push(key);
            }
        },
        updateVariable(envId, key, value) {
            const env = this.environments.find(e => e.id === envId);
            if (env && env.variables[key] !== undefined) env.variables[key] = value;
        },
        removeVariable(envId, key) {
            const env = this.environments.find(e => e.id === envId);
            if (env) {
                delete env.variables[key];
                env.secrets = env.secrets.filter(k => k !== key);
            }
        },
        setVariableSecret(envId, key, isSecret) {
            const env = this.environments.find(e => e.id === envId);
            if (env) {
                if (isSecret && !env.secrets.includes(key)) env.secrets.push(key);
                if (!isSecret) env.secrets = env.secrets.filter(k => k !== key);
            }
        }
    }
});
