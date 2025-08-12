<template>
    <div class="h-full w-full flex bg-[#18181B] overflow-hidden">
        <!-- Sidebar Navigation -->
        <nav class="w-16 md:w-20 flex flex-col items-center py-6 gap-6 bg-[#23272A] border-r border-zinc-800 min-h-0">
            <button v-for="item in sidebarItems" :key="item.key" @click="activePane = item.key"
                :class="['flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-150',
                    activePane === item.key ? 'bg-[#272822] text-cyan-400' : 'text-gray-400 hover:bg-[#272822]/60 hover:text-cyan-300']" :aria-label="item.label" :title="item.label">
                <span v-html="item.icon" class="w-6 h-6"></span>
                <span class="text-[10px] font-bold">{{ item.label }}</span>
            </button>
        </nav>
        <!-- Main Workspace -->
        <main class="flex-1 flex flex-col h-full min-h-0 overflow-auto p-0 bg-[#18181B]">
            <section v-if="activePane === 'request'"
                class="h-full flex flex-col max-w-5xl mx-auto bg-[#23272A] rounded-xl shadow-xl border border-[#444] mt-8 mb-8 overflow-hidden">
                <div class="flex items-center gap-2 px-6 pt-6 pb-2 border-b border-[#444]" role="tablist"
                    aria-label="Request Tabs" style="overflow-x:auto;">
                    <select v-model="activeGroup" @change="switchGroup(activeGroup)"
                        class="px-2 py-1 rounded bg-[#23272A] text-white border border-zinc-700 mr-2">
                        <option v-for="g in tabGroups" :key="g" :value="g">{{ g }}</option>
                    </select>
                    <button @click="addGroup(prompt('New group name:') || 'New Group')"
                        class="px-2 py-1 rounded bg-purple-900 text-purple-200 text-xs font-bold mr-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-150 hover:scale-105 active:scale-95"
                        aria-label="Add new group" title="Create a new tab group">+ Group</button>
                    <div class="flex gap-1 flex-1 overflow-x-auto">
                        <button v-for="(tab, idx) in requestTabs.filter(t => t.group === activeGroup)" :key="tab.id"
                            @click="activeTab = idx"
                            :class="['px-3 py-1 rounded-t-lg font-mono text-xs transition-colors duration-150', activeTab === idx ? 'bg-[#23272e] text-cyan-400 border-b-2 border-cyan-400' : 'bg-[#23272e]/60 text-gray-400 hover:text-cyan-300', tab.selected ? 'ring-2 ring-cyan-400' : '']"
                            :aria-selected="activeTab === idx" role="tab" tabindex="0"
                            :aria-label="`Request Tab: ${tab.title}`">
                            <input type="checkbox" v-model="tab.selected" @click.stop="toggleSelectTab(idx)"
                                class="mr-1 align-middle" />
                            {{ tab.title }}
                            <span v-if="requestTabs.length > 1" @click.stop="closeTab(idx)"
                                class="ml-2 text-red-400 cursor-pointer">&times;</span>
                        </button>
                    </div>
                    <button @click="addTab(activeGroup)"
                        class="ml-2 px-2 py-1 rounded bg-cyan-900 text-cyan-200 hover:bg-cyan-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-150 hover:scale-105 active:scale-95"
                        aria-label="Add new tab" title="Open a new request tab">+</button>
                    <button @click="closeSelectedTabs"
                        class="ml-2 px-2 py-1 rounded bg-red-900 text-red-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50"
                        aria-label="Close selected tabs" title="Close all selected tabs"
                        :disabled="requestTabs.filter(tab => tab.selected).length === 0">Close Selected</button>
                </div>
                <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto" tabindex="0"
                    aria-label="Request Pane">
                    <div class="w-full max-w-3xl mx-auto">
                        <RequestComposer :initialRequest="requestTabs[activeTab].request" @send="sendRequest" />
                    </div>
                </div>
            </section>
            <section v-else-if="activePane === 'response'"
                class="h-full flex flex-col max-w-5xl mx-auto bg-[#23272A] rounded-xl shadow-xl border border-[#444] mt-8 mb-8 overflow-hidden">
                <div class="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 class="text-lg md:text-xl font-bold text-purple-400 drop-shadow-[0_0_8px_purple]">Response</h2>
                </div>
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
                <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto" tabindex="0"
                    aria-label="Response Pane">
                    <div class="w-full max-w-3xl mx-auto">
                        <template v-if="loading">
                            <div class="text-center text-cyan-400 py-8 animate-pulse">Loading...</div>
                        </template>
                        <template v-else-if="error">
                            <div class="text-center text-red-400 py-8 animate-shake">{{ error }}</div>
                        </template>
                        <template v-else>
                            <ResponseViewer
                                :response="{ ...response, status: undefined, time: undefined, size: undefined }" />
                        </template>
                    </div>
                </div>
            </section>
            <section v-else-if="activePane === 'history'"
                class="h-full flex flex-col max-w-5xl mx-auto bg-[#23272A] rounded-xl shadow-xl border border-[#444] mt-8 mb-8 overflow-hidden">
                <div class="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 class="text-lg md:text-xl font-bold text-[#fd971f]">History</h2>
                </div>
                <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto" tabindex="0"
                    aria-label="History Pane">
                    <div class="w-full max-w-3xl mx-auto">
                        <ul class="space-y-2 overflow-x-auto">
                            <li v-for="item in store.history" :key="item.id"
                                class="flex items-center gap-2 bg-[#49483e]/70 hover:bg-[#49483e]/90 rounded-lg px-3 py-2 transition-colors duration-150 cursor-pointer border-l-4 border-transparent hover:border-[#a6e22e] w-full flex-grow focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                                tabindex="0" role="button"
                                aria-label="History item: {{ item.method }} {{ item.endpoint }} at {{ item.time }}"
                                @keydown.enter="selectHistory(item)" @keydown.space.prevent="selectHistory(item)"
                                @click="selectHistory(item)">
                                <span class="text-xs font-bold px-2 py-1 rounded bg-[#272822] text-[#a6e22e]">{{
                                    item.method
                                    }}</span>
                                <span class="text-[#f8f8f2] truncate flex-1 min-w-0" title="{{ item.endpoint }}">{{
                                    item.endpoint
                                    }}</span>
                                <span class="text-[#fd971f] text-xs" title="Request time">{{ item.time }}</span>
                                <span v-if="item.status !== undefined" class="text-green-400 text-xs font-mono"
                                    title="Status code">{{ item.status }}</span>
                                <span v-if="item.responseTime !== undefined" class="text-blue-400 text-xs font-mono"
                                    title="Response time">{{ item.responseTime }}ms</span>
                                <span v-if="item.size !== undefined" class="text-pink-400 text-xs font-mono"
                                    title="Response size">{{ item.size }}B</span>
                                <span class="text-gray-500 text-[10px] font-mono ml-2 select-all" title="UUID">{{
                                    item.id }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section v-else-if="activePane === 'curl'"
                class="h-full flex flex-col max-w-5xl mx-auto bg-[#23272A] rounded-xl shadow-xl border border-[#444] mt-8 mb-8 overflow-hidden">
                <div class="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 class="text-lg md:text-xl font-bold text-[#66d9ef]">cURL</h2>
                </div>
                <div class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto" tabindex="0" aria-label="cURL Pane">
                    <div class="w-full max-w-3xl mx-auto">
                        <ul class="divide-y divide-[#31343a]">
                            <li v-for="(entry, idx) in curlHistory.slice(0, 10)" :key="idx"
                                class="flex items-center group px-0 py-0 min-h-[2.5rem]">
                                <span class="text-[#66d9ef] font-mono text-xs px-2 select-none">#{{ curlHistory.length -
                                    idx
                                    }}</span>
                                <span class="text-[#fd971f] font-mono text-[10px] px-2 select-none"
                                    :title="entry.time">{{
                                    entry.time }}</span>
                                <code
                                    class="flex-1 text-[#f8f8f2] text-xs font-mono overflow-x-auto whitespace-nowrap truncate bg-transparent px-0 py-0"
                                    tabindex="0" :title="entry.cmd">{{ entry.cmd }}</code>
                                <button
                                    class="ml-2 px-2 py-1 rounded border border-[#66d9ef] text-[#66d9ef] bg-[#23272e] hover:bg-[#66d9ef] hover:text-[#23272e] focus:bg-[#66d9ef] focus:text-[#23272e] text-xs font-mono transition-colors duration-150"
                                    @click="copyCurl(entry.cmd)" tabindex="0"
                                    aria-label="Copy cURL command {{ idx + 1 }}">Copy</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!-- Add more panes for Collections, Environments, etc. as needed -->
        </main>
    </div>
</template>

<script setup>
// Sidebar navigation state
const sidebarItems = [
    { key: 'request', label: 'Request', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>' },
    { key: 'response', label: 'Response', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" /></svg>' },
    { key: 'history', label: 'History', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>' },
    { key: 'curl', label: 'cURL', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 8h8v8H8z" /></svg>' },
    // Add more items for Collections, Environments, etc.
];
const activePane = ref('request');
import { ref, computed, watch, onMounted } from 'vue';
import fetchToCurl from 'fetch-to-curl';
import { useMainStore } from '../store';
import RequestComposer from '../components/RequestComposer.vue';
import ResponseViewer from '../components/ResponseViewer.vue';
import { sendHttpRequest } from '../utils/api';
import { saveRequest } from '../utils/storage';

// Collapsed state for panes
const collapsed = ref({ request: false, response: false, history: false, curl: false });
const curlCommand = ref('');
// Each entry: { cmd: string, time: string }
const curlHistory = ref([]); // Array of { cmd, time }

// Tab grouping and multi-select
const defaultRequest = { method: 'GET', url: '', headers: {}, body: '' };
const requestTabs = ref([
    { id: Date.now(), title: 'Tab 1', group: 'Default', selected: false, request: { ...defaultRequest } }
]);
const activeTab = ref(0);
const tabGroups = ref(['Default']);
const activeGroup = ref('Default');

// Auto-save tabs to localStorage
watch(requestTabs, (tabs) => {
    localStorage.setItem('unsaved_tabs', JSON.stringify(tabs));
}, { deep: true });

// Recover tabs on mount
onMounted(() => {
    const savedTabs = localStorage.getItem('unsaved_tabs');
    if (savedTabs) {
        try {
            const tabs = JSON.parse(savedTabs);
            if (Array.isArray(tabs) && tabs.length) {
                requestTabs.value = tabs;
            }
        } catch { }
    }
});

function addTab(group = activeGroup.value) {
    requestTabs.value.push({
        id: Date.now() + Math.random(),
        title: `Tab ${requestTabs.value.length + 1}`,
        group,
        selected: false,
        request: { ...defaultRequest }
    });
    activeTab.value = requestTabs.value.length - 1;
}
function closeTab(idx) {
    if (requestTabs.value.length === 1) return;
    requestTabs.value.splice(idx, 1);
    if (activeTab.value >= requestTabs.value.length) {
        activeTab.value = requestTabs.value.length - 1;
    }
}
function toggleSelectTab(idx) {
    requestTabs.value[idx].selected = !requestTabs.value[idx].selected;
}
function addGroup(name) {
    if (!tabGroups.value.includes(name)) tabGroups.value.push(name);
    activeGroup.value = name;
}
function switchGroup(name) {
    activeGroup.value = name;
}
function closeSelectedTabs() {
    const selected = requestTabs.value.filter(tab => tab.selected);
    if (selected.length === 0) return;
    requestTabs.value = requestTabs.value.filter(tab => !tab.selected);
    activeTab.value = Math.min(activeTab.value, requestTabs.value.length - 1);
}

// Pinia store
const store = useMainStore();
const response = computed(() => store.response);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// Keep currentRequest in sync with active tab
watch(() => activeTab.value, (newIdx) => {
    store.setRequest(requestTabs.value[newIdx].request);
});

// Send HTTP request and update response panel using centralized state
async function sendRequest(request) {
    // Save request to active tab
    requestTabs.value[activeTab.value].request = { ...request };
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
        // Add to Pinia history (save full response)
        const now = new Date();
        store.history.unshift({
            id: Date.now(),
            method: request.method,
            url: request.url,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            response: { ...res } // Save full response object
        });
        // If saving to a collection, also save full response
        if (store.activeCollectionId) {
            const col = store.collections.find(c => c.id === store.activeCollectionId);
            if (col) {
                col.requests.push({
                    id: Date.now(),
                    method: request.method,
                    url: request.url,
                    request,
                    response: { ...res },
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }
        }
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
