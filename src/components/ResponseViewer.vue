<template>
    <div v-if="response"
        class="border border-[#f92672] rounded-xl p-6 text-base text-[#f8f8f2] font-mono flex-1 min-h-0 overflow-auto shadow-md transition-all duration-200 animate-fade-in bg-[#272822] backdrop-blur-xl">
        <div>
            <!-- Subtle Toggle Buttons -->
            <div class="flex gap-2 mb-4">
                <button :aria-pressed="showBody" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showBody ? 'bg-[#a6e22e]/70 text-[#272822] border-[#a6e22e] shadow-sm' : 'bg-[#272822]/60 text-[#a6e22e] border-[#75715e] hover:bg-[#49483e]/40',
                    'focus:ring-2 focus:ring-[#a6e22e] focus:ring-offset-2'
                ]" @click="showBody = !showBody" tabindex="0">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showBody" class="h-3 w-3 text-[#a6e22e]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Body
                    </span>
                </button>
                <button :aria-pressed="showHeaders" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showHeaders ? 'bg-[#fd971f]/70 text-[#272822] border-[#fd971f] shadow-sm' : 'bg-[#272822]/60 text-[#fd971f] border-[#75715e] hover:bg-[#49483e]/40',
                    'focus:ring-2 focus:ring-[#fd971f] focus:ring-offset-2'
                ]" @click="showHeaders = !showHeaders" tabindex="0">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showHeaders" class="h-3 w-3 text-[#fd971f]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Headers
                    </span>
                </button>
            </div>
            <!-- Toggle Content -->
            <div v-if="showBody">
                <pre
                    class="bg-[#272822] rounded-xl p-4 text-[#a6e22e] text-sm mb-2 overflow-auto w-full transition-all duration-200 font-mono border border-[#a6e22e]">{{ response.body }}</pre>
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
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const response = computed(() => store.response);
const showBody = ref(true);
const showHeaders = ref(false);
</script>
