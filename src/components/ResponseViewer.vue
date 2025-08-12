<template>
    <div v-if="response"
        class="border border-[#f92672] rounded-xl p-4 sm:p-6 text-base text-[#f8f8f2] font-mono flex-1 min-h-0 overflow-auto shadow-md transition-all duration-200 animate-fade-in bg-[#272822] backdrop-blur-xl">
        <div>
            <!-- Subtle Toggle Buttons -->
            <div class="flex gap-2 flex-wrap mb-4" role="tablist" aria-label="Response Tabs">
                <button :aria-pressed="showBody" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showBody ? 'bg-[#a6e22e]/70 text-[#272822] border-[#a6e22e] shadow-sm' : 'bg-[#272822]/60 text-[#a6e22e] border-[#75715e] hover:bg-[#49483e]/40 disabled:opacity-50',
                    'focus:ring-2 focus:ring-[#a6e22e] focus:ring-offset-2'
                ]" @click="showBody = !showBody" tabindex="0" aria-label="Response Body Tab" title="Show response body"
                    :disabled="!response">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showBody" class="h-4 w-4 text-[#a6e22e]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Body
                    </span>
                </button>
                <button :aria-pressed="showHeaders" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showHeaders ? 'bg-[#fd971f]/70 text-[#272822] border-[#fd971f] shadow-sm' : 'bg-[#272822]/60 text-[#fd971f] border-[#75715e] hover:bg-[#49483e]/40 disabled:opacity-50',
                    'focus:ring-2 focus:ring-[#fd971f] focus:ring-offset-2'
                ]" @click="showHeaders = !showHeaders" tabindex="0" aria-label="Response Headers Tab"
                    title="Show response headers" :disabled="!response">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showHeaders" class="h-4 w-4 text-[#fd971f]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Headers
                    </span>
                </button>
                <button :aria-pressed="showAuth" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showAuth ? 'bg-[#66d9ef]/70 text-[#272822] border-[#66d9ef] shadow-sm' : 'bg-[#272822]/60 text-[#66d9ef] border-[#75715e] hover:bg-[#49483e]/40 disabled:opacity-50',
                    'focus:ring-2 focus:ring-[#66d9ef] focus:ring-offset-2'
                ]" @click="showAuth = !showAuth" tabindex="0" aria-label="Response Auth Tab"
                    title="Show authorization info" :disabled="!response">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showAuth" class="h-4 w-4 text-[#66d9ef]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Auth
                    </span>
                </button>
            </div>
            <!-- Toggle Content -->
            <div v-if="showBody">
                <div class="flex gap-2 mb-2 flex-wrap">
                    <button
                        :class="['px-2 py-1 rounded text-xs', previewMode === 'pretty' ? 'bg-[#a6e22e] text-[#272822]' : 'bg-[#272822] text-[#a6e22e] border border-[#a6e22e] disabled:opacity-50']"
                        @click="previewMode = 'pretty'" title="Pretty print response body"
                        :disabled="!response">Pretty</button>
                    <button
                        :class="['px-2 py-1 rounded text-xs', previewMode === 'raw' ? 'bg-[#fd971f] text-[#272822]' : 'bg-[#272822] text-[#fd971f] border border-[#fd971f] disabled:opacity-50']"
                        @click="previewMode = 'raw'" title="Show raw response body" :disabled="!response">Raw</button>
                    <button
                        :class="['px-2 py-1 rounded text-xs', previewMode === 'html' ? 'bg-[#66d9ef] text-[#272822]' : 'bg-[#272822] text-[#66d9ef] border border-[#66d9ef] disabled:opacity-50']"
                        @click="previewMode = 'html'" title="Show response as HTML" :disabled="!response">HTML</button>
                </div>
                <pre v-if="previewMode !== 'html'" ref="bodyRef" @scroll="handleScroll"
                    class="bg-[#272822] rounded-xl p-4 text-[#a6e22e] text-sm mb-2 overflow-x-auto w-full min-w-0 transition-all duration-200 font-mono border border-[#a6e22e] focus:outline-none focus:ring-2 focus:ring-[#a6e22e] focus:ring-offset-2"
                    style="max-height: 40vh;" aria-label="Response Body Preview">
                    {{ formattedBody }}
                </pre>
                <div v-else class="bg-white rounded-xl p-4 mb-2 overflow-auto w-full min-w-0 border border-[#66d9ef]"
                    style="max-height: 40vh;">
                    <iframe :srcdoc="response.value.body" style="width:100%;height:100%;border:none;"></iframe>
                </div>
                <div
                    class="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center text-xs text-[#a6e22e]">
                    <span>Status: <span class="text-[#fd971f] font-bold">{{ response.status }}</span></span>
                    <span>Time: <span class="text-[#66d9ef]">{{ response.time }} ms</span></span>
                    <span>Size: <span class="text-[#f92672]">{{ response.size }} bytes</span></span>
                </div>
            </div>
            <div v-if="showHeaders">
                <label for="response-headers" class="font-semibold text-[#fd971f] mb-1 block">Headers:</label>
                <pre id="response-headers"
                    class="bg-[#272822] p-3 rounded-xl border border-[#fd971f] overflow-x-auto text-xs text-[#fd971f] transition-all duration-200 font-mono"
                    aria-label="Response headers">{{ response.headers }}</pre>
            </div>
            <div v-if="showAuth">
                <label class="font-semibold text-[#66d9ef] mb-1 block">Authorization:</label>
                <pre class="bg-[#272822] p-3 rounded-xl border border-[#66d9ef] overflow-x-auto text-xs text-[#66d9ef] transition-all duration-200 font-mono"
                    aria-label="Authorization info">
                    {{ authInfo }}
                </pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const response = computed(() => store.response);
const showBody = ref(true);
const showHeaders = ref(false);
const showAuth = ref(false);
const previewMode = ref('pretty'); // 'pretty', 'raw', 'html'
const bodyScroll = ref(0);
const bodyRef = ref(null);

function handleScroll() {
    if (bodyRef.value) bodyScroll.value = bodyRef.value.scrollTop;
}

// Restore scroll position when body is shown
watch(showBody, (val) => {
    if (val && bodyRef.value) {
        bodyRef.value.scrollTop = bodyScroll.value;
    }
});

const formattedBody = computed(() => {
    if (!response.value || !response.value.body) return '';
    if (previewMode.value === 'raw') return response.value.body;
    if (previewMode.value === 'html') return response.value.body;
    // pretty mode
    try {
        return JSON.stringify(JSON.parse(response.value.body), null, 2);
    } catch {
        return response.value.body;
    }
});

// Extract authorization info from response headers
const authInfo = computed(() => {
    if (!response.value || !response.value.headers) return '';
    try {
        const headers = JSON.parse(response.value.headers);
        const authHeader = Object.entries(headers).find(([k]) => k.toLowerCase().includes('auth'));
        if (authHeader) return `${authHeader[0]}: ${authHeader[1]}`;
    } catch { }
    return 'No authorization info.';
});
</script>
