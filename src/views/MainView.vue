<template>
    <main class="flex flex-col md:flex-row gap-4 md:gap-8 h-full min-h-0 w-full px-2 md:px-0">
        <section
            class="flex-1 flex flex-col bg-[#272822] rounded-xl shadow-2xl p-6 border border-[#f92672] min-h-0 h-full justify-start transition-all duration-300 ease-in-out mb-4 md:mb-0 backdrop-blur-xl">
            <h2 class="text-lg md:text-xl font-bold text-cyan-400 mb-4">Request</h2>
            <div class="flex-1 flex flex-col min-h-0">
                <RequestComposer :initialRequest="currentRequest" @send="sendRequest" />
            </div>
        </section>
        <section
            class="flex-1 flex flex-col bg-[#272822] rounded-xl shadow-2xl p-6 border border-[#a6e22e] min-h-0 h-full justify-start overflow-auto transition-all duration-300 ease-in-out backdrop-blur-xl">
            <h2 class="text-lg md:text-xl font-bold text-purple-400 mb-4 drop-shadow-[0_0_8px_purple]">Response</h2>
            <div class="flex-1 flex flex-col min-h-0 overflow-auto">
                <template v-if="loading">
                    <div class="text-center text-cyan-400 py-8 animate-pulse">Loading...</div>
                </template>
                <template v-else-if="error">
                    <div class="text-center text-red-400 py-8 animate-shake">{{ error }}</div>
                </template>
                <template v-else>
                    <ResponseViewer :response="response" />
                </template>
            </div>
        </section>
    </main>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../store';
import RequestComposer from '../components/RequestComposer.vue';
import ResponseViewer from '../components/ResponseViewer.vue';
import { sendHttpRequest } from '../utils/api';
import { saveRequest } from '../utils/storage';



// Pinia store
const store = useMainStore();
const response = computed(() => store.response);
const currentRequest = computed(() => store.currentRequest);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// Add custom micro-interaction animation for error
// UnoCSS: animate-shake (add to unocss.config if not present)

/**
 * Send HTTP request and update response panel using centralized state.
 */
async function sendRequest(request) {
    store.setResponse(null);
    store.setError('');
    store.setLoading(true);
    store.setRequest(request);
    const start = performance.now();
    try {
        const res = await sendHttpRequest(request);
        res.time = Math.round(performance.now() - start);
        store.setResponse(res);
        saveRequest(request);
        // Add to Pinia history
        const now = new Date();
        store.history.unshift({
            id: Date.now(),
            method: request.method,
            endpoint: request.url,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    } catch (e) {
        store.setError(e.message || 'Request failed.');
    } finally {
        store.setLoading(false);
    }
}
</script>
