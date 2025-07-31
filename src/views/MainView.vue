<template>
    <div class="h-full min-h-0 w-full min-w-0 px-2 md:px-0 grid gap-4 overflow-x-auto"
        style="grid-template-columns: repeat(12, 1fr); grid-template-rows: minmax(45vh, 45vh) minmax(45vh, 45vh) minmax(20vh, 1fr) minmax(20vh, 1fr); background-color: #1b1b1b;">
        <!-- Request Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#f92672] h-full min-h-[40vh] transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="request-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="request-pane-header" class="text-lg md:text-xl font-bold text-cyan-400">Request</h2>
            </div>
            <div v-if="!collapsed.request" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <RequestComposer :initialRequest="currentRequest" @send="sendRequest" />
            </div>
        </section>
        <!-- Response Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#a6e22e] h-full min-h-[40vh] transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="response-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="response-pane-header"
                    class="text-lg md:text-xl font-bold text-purple-400 drop-shadow-[0_0_8px_purple]">Response</h2>
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
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#fd971f] h-full min-h-[40vh] overflow-y-auto transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="history-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="history-pane-header" class="text-lg md:text-xl font-bold text-[#fd971f]">History</h2>
            </div>
            <div v-if="!collapsed.history" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <ul class="space-y-2 overflow-x-auto">
                    <li v-for="item in store.history" :key="item.id"
                        class="flex items-center gap-2 bg-[#49483e]/70 hover:bg-[#49483e]/90 rounded-lg px-3 py-2 transition-colors duration-150 cursor-pointer border-l-4 border-transparent hover:border-[#a6e22e] w-full flex-grow"
                        tabindex="0" role="button"
                        aria-label="History item: {{ item.method }} {{ item.endpoint }} at {{ item.time }}"
                        @keydown.enter="selectHistory(item)" @keydown.space.prevent="selectHistory(item)"
                        @click="selectHistory(item)">
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
                        <span class="text-gray-500 text-[10px] font-mono ml-2 select-all" title="UUID">{{ item.id
                            }}</span>
                    </li>
                </ul>
            </div>
        </section>
        <!-- Curl Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#66d9ef] h-full min-h-[40vh] overflow-y-auto transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="curl-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="curl-pane-header" class="text-lg md:text-xl font-bold text-[#66d9ef]">cURL</h2>
            </div>
            <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <ul class="divide-y divide-[#31343a]">
                    <li v-for="(entry, idx) in curlHistory.slice(0, 10)" :key="idx"
                        class="flex items-center group px-0 py-0 min-h-[2.5rem]">
                        <span class="text-[#66d9ef] font-mono text-xs px-2 select-none">#{{ curlHistory.length - idx
                        }}</span>
                        <span class="text-[#fd971f] font-mono text-[10px] px-2 select-none" :title="entry.time">{{
                            entry.time
                        }}</span>
                        <code
                            class="flex-1 text-[#f8f8f2] text-xs font-mono overflow-x-auto whitespace-nowrap truncate bg-transparent px-0 py-0"
                            tabindex="0" :title="entry.cmd">{{ entry.cmd }}</code>
                        <button
                            class="ml-2 px-2 py-1 rounded border border-[#66d9ef] text-[#66d9ef] bg-[#23272e] hover:bg-[#66d9ef] hover:text-[#23272e] focus:bg-[#66d9ef] focus:text-[#23272e] text-xs font-mono transition-colors duration-150"
                            @click="copyCurl(entry.cmd)" tabindex="0" aria-label="Copy cURL command {{ idx + 1 }}">
                            Copy
                        </button>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import fetchToCurl from 'fetch-to-curl';
import { useMainStore } from '../store';
import RequestComposer from '../components/request/RequestComposer.vue';
import ResponseViewer from '../components/ResponseViewer.vue';
import { sendHttpRequest } from '../utils/api';
import { saveRequest } from '../utils/storage';

// Collapsed state for panes
const collapsed = ref({ request: false, response: false, history: false, curl: false });
const curlCommand = ref('');
// Each entry: { cmd: string, time: string }
const curlHistory = ref([]); // Array of { cmd, time }

// Pinia store
const store = useMainStore();
const response = computed(() => store.response);
const currentRequest = computed(() => store.currentRequest);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// Send HTTP request and update response panel using centralized state
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
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: res.status,
            responseTime: res.time,
            size: res.size
        });
        // Generate cURL command
        const generated = generateCurlCommand(request);
        curlCommand.value = generated;
        // Add timestamp to cURL history
        curlHistory.value.unshift({
            cmd: generated,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        // Limit history to 20 entries
        if (curlHistory.value.length > 20) curlHistory.value.length = 20;
    } catch (e) {
        store.setError(e?.message || 'Request failed.');
        curlCommand.value = '';
    } finally {
        store.setLoading(false);
    }
}

// Copy cURL command to clipboard
function copyCurl(cmd) {
    navigator.clipboard?.writeText(cmd);
}

// Allow history selection via keyboard or click
function selectHistory(item) {
    // Restore the full request if available
    const historyRequest = {
        method: item.method,
        url: item.endpoint,
        ...(item.headers && { headers: item.headers }),
        ...(item.body && { body: item.body })
    };
    store.setRequest(historyRequest);
}

// Generates a cURL command string based on the given HTTP request object
function generateCurlCommand(request) {
    const fetchObj = {
        url: request.url,
        method: request.method,
        headers: {},
        body: undefined
    };
    if (request.headers) {
        try {
            fetchObj.headers = typeof request.headers === 'string' ? JSON.parse(request.headers) : request.headers;
        } catch {
            fetchObj.headers = {};
        }
    }
    if (request.body) {
        fetchObj.body = request.body;
    }
    return fetchToCurl(fetchObj.url, {
        method: fetchObj.method,
        headers: fetchObj.headers,
        body: fetchObj.body
    });
}
</script>
