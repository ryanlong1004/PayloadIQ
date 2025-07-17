<template>
    <div class="h-full min-h-0 w-full min-w-0 px-2 md:px-0 grid gap-4 overflow-x-auto"
        style="grid-template-columns: 1fr 1fr; grid-template-rows: 40vh 40vh; background-color: #1b1b1b;">
        <!-- Request Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#f92672] h-full transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-1">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 class="text-lg md:text-xl font-bold text-cyan-400">Request</h2>
            </div>
            <div v-if="!collapsed.request" class="flex-1 flex flex-col min-h-0 px-6 pb-6">
                <RequestComposer :initialRequest="currentRequest" @send="sendRequest" />
            </div>
        </section>
        <!-- Response Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#a6e22e] h-full transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-1">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 class="text-lg md:text-xl font-bold text-purple-400 drop-shadow-[0_0_8px_purple]">Response</h2>
            </div>
            <!-- Persistent Response Info Bar -->
            <div class="flex gap-2 items-center px-6 pb-2">
                <span v-if="response && response.status !== undefined"
                    class="inline-block px-2 py-1 rounded-full bg-green-900 text-green-300 text-xs font-bold border border-green-400 shadow">Status:
                    {{ response.status }}</span>
                <span v-if="response && response.time !== undefined"
                    class="inline-block px-2 py-1 rounded-full bg-blue-900 text-blue-300 text-xs font-bold border border-blue-400 shadow">Time:
                    {{ response.time }} ms</span>
                <span v-if="response && response.size !== undefined"
                    class="inline-block px-2 py-1 rounded-full bg-pink-900 text-pink-300 text-xs font-bold border border-pink-400 shadow">Size:
                    {{ response.size }} bytes</span>
            </div>
            <div v-if="!collapsed.response" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <template v-if="loading">
                    <div class="text-center text-cyan-400 py-8 animate-pulse">Loading...</div>
                </template>
                <template v-else-if="error">
                    <div class="text-center text-red-400 py-8 animate-shake">{{ error }}</div>
                </template>
                <template v-else>
                    <ResponseViewer :response="{ ...response, status: undefined, time: undefined, size: undefined }" />
                </template>
            </div>
        </section>
        <!-- History Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#fd971f] h-full transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-2">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 class="text-lg md:text-xl font-bold text-[#fd971f]">History</h2>
            </div>
            <div v-if="!collapsed.history" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <ul class="space-y-2 overflow-x-auto">
                    <li v-for="item in store.history" :key="item.id"
                        class="flex items-center gap-2 bg-[#49483e]/70 hover:bg-[#49483e]/90 rounded-lg px-3 py-2 transition-colors duration-150 cursor-pointer border-l-4 border-transparent hover:border-[#a6e22e] max-w-full">
                        <span class="text-xs font-bold px-2 py-1 rounded bg-[#272822] text-[#a6e22e]">{{ item.method
                        }}</span>
                        <span class="text-[#f8f8f2] truncate flex-1 min-w-0">{{ item.endpoint }}</span>
                        <span class="text-[#fd971f] text-xs">{{ item.time }}</span>
                        <span v-if="item.status !== undefined" class="text-green-400 text-xs font-mono">{{ item.status
                        }}</span>
                        <span v-if="item.responseTime !== undefined" class="text-blue-400 text-xs font-mono">{{
                            item.responseTime }}ms</span>
                        <span v-if="item.size !== undefined" class="text-pink-400 text-xs font-mono">{{ item.size
                        }}B</span>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// Track collapsed state for each pane
const collapsed = ref({ request: false, response: false, history: false });
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
