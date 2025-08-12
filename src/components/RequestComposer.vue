<template>
    <form @submit.prevent="onSend"
        class="bg-[#272822] backdrop-blur-xl rounded-xl shadow-md border border-[#f92672] w-full max-w-xl mx-auto space-y-6 transition-all duration-200 animate-fade-in font-inter">
        <div class="flex justify-end gap-2 mb-2">
            <button type="button" @click="openCurlImport"
                class="px-3 py-1 rounded text-xs bg-blue-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Import cURL" title="Import a cURL command">Import cURL</button>
            <button type="button" @click="showCurlModal = true"
                class="px-3 py-1 rounded text-xs bg-green-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Export cURL" title="Export current request as cURL">Export cURL</button>
        </div>
        <!-- cURL Modal -->
        <div v-if="showCurlModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div
                class="bg-[#23272A] rounded-xl shadow-2xl p-6 w-full max-w-lg flex flex-col gap-4 border border-[#fd971f]">
                <h3 class="text-lg font-bold text-white mb-2">cURL Import/Export</h3>
                <textarea v-model="curlInput" placeholder="Paste cURL command here to import"
                    class="w-full h-24 bg-[#18181B] text-white rounded p-2 border border-zinc-700 font-mono mb-2"></textarea>
                <div class="flex gap-2">
                    <button @click="importCurl"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">Import</button>
                    <button @click="closeCurlModal"
                        class="bg-gray-600 text-white px-3 py-1 rounded text-xs">Close</button>
                </div>
                <div class="mt-4">
                    <label class="block text-sm text-gray-400 mb-1">Exported cURL:</label>
                    <pre
                        class="bg-[#18181B] text-green-400 rounded p-2 border border-zinc-700 font-mono">{{ curlOutput }}</pre>
                </div>
            </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select v-model="localRequest.method"
                class="bg-[#272822] border border-[#a6e22e] text-[#a6e22e] text-base rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#a6e22e] transition-all duration-200 font-semibold shadow-md focus:outline-none min-w-[90px]"
                aria-label="HTTP Method" title="Select HTTP method">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
            </select>
            <input v-model="localRequest.url" type="text" placeholder="Enter URL"
                class="flex-1 bg-[#272822] border border-[#fd971f] text-[#fd971f] px-4 py-2 rounded-xl text-base focus:ring-2 focus:ring-[#fd971f] transition-all duration-200 font-mono shadow-md focus:outline-none min-w-[120px]"
                aria-label="Request URL" title="Enter the request URL" />
            <button type="submit"
                class="px-4 py-2 rounded-lg text-[#a6e22e] font-semibold text-sm border border-[#a6e22e] bg-[#272822] hover:bg-[#49483e] hover:text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#a6e22e] focus:ring-offset-2 transition-all duration-150 shadow-sm disabled:opacity-50"
                aria-label="Send Request" title="Send the HTTP request" :disabled="!localRequest.url.trim()">
                <span class="inline-flex items-center gap-2">
                    <svg class="h-5 w-5 text-[#a6e22e]" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Send Request
                </span>
            </button>
        </div>
        <div>
            <label for="headers-input" class="block text-[#66d9ef] text-base font-semibold mb-2">Headers
                <span class="text-xs text-[#66d9ef] ml-2" title="Add custom headers as JSON">(e.g., {'Content-Type':
                    'application/json'})</span>
            </label>
            <textarea id="headers-input" v-model="localRequest.headers"
                class="w-full bg-[#272822] text-base text-[#66d9ef] font-mono border border-[#66d9ef] rounded-xl p-3 h-20 focus:ring-2 focus:ring-[#66d9ef] transition-all duration-200 resize-y shadow-md focus:outline-none"
                placeholder='{ "Content-Type": "application/json" }' aria-label="Request headers"
                title="Add custom headers as JSON"></textarea>
        </div>
        <div>
            <label for="body-input" class="block text-[#f92672] text-base font-semibold mb-2">Body
                <span class="text-xs text-[#f92672] ml-2" title="Enter JSON body for POST/PUT requests">(JSON
                    only)</span>
            </label>
            <textarea id="body-input" v-model="localRequest.body"
                class="w-full bg-[#272822] text-base text-[#f92672] font-mono border border-[#f92672] rounded-xl p-3 h-32 focus:ring-2 focus:ring-[#f92672] transition-all duration-200 resize-y shadow-md focus:outline-none"
                placeholder="JSON body" aria-label="Request body"
                title="Enter JSON body for POST/PUT requests"></textarea>
        </div>
    </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useMainStore } from '../store';
import { parseCurl, generateCurl } from '../utils/curl';

const store = useMainStore();
const emit = defineEmits(['send']);
const localRequest = ref({ ...store.currentRequest });
const showCurlModal = ref(false);
const curlInput = ref('');
const curlOutput = computed(() => generateCurl(localRequest.value));

watch(() => store.currentRequest, (val) => {
    if (val) localRequest.value = { ...val };
}, { immediate: true });

function substituteVars(str, vars) {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/{{\s*([\w.-]+)\s*}}/g, (m, key) => vars[key] ?? m);
}

const activeEnv = computed(() => store.environments.find(e => e.id === store.activeEnvironmentId));

const onSend = () => {
    const vars = activeEnv.value?.variables || {};
    const substituted = {
        ...localRequest.value,
        url: substituteVars(localRequest.value.url, vars),
        headers: substituteVars(localRequest.value.headers, vars),
        body: substituteVars(localRequest.value.body, vars)
    };
    emit('send', substituted);
};

function openCurlImport() {
    showCurlModal.value = true;
    curlInput.value = '';
}
function importCurl() {
    const parsed = parseCurl(curlInput.value);
    localRequest.value = { ...localRequest.value, ...parsed };
    showCurlModal.value = false;
}
function closeCurlModal() {
    showCurlModal.value = false;
}
</script>
