<template>
    <div v-if="response"
        class="border border-purple-400 rounded-xl p-6 text-base text-gray-200 font-mono flex-1 min-h-0 overflow-auto shadow-md transition-all duration-200 animate-fade-in bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-xl">
        <div>
            <!-- Subtle Toggle Buttons -->
            <div class="flex gap-2 mb-4">
                <button :aria-pressed="showBody" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showBody ? 'bg-cyan-900/70 text-cyan-200 border-cyan-400 shadow-sm' : 'bg-gray-900/60 text-cyan-400 border-gray-700 hover:bg-cyan-900/40',
                    'focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2'
                ]" @click="showBody = !showBody" tabindex="0">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showBody" class="h-3 w-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Body
                    </span>
                </button>
                <button :aria-pressed="showHeaders" :class="[
                    'px-3 py-1 rounded font-medium text-xs focus:outline-none transition-colors border',
                    showHeaders ? 'bg-purple-900/70 text-purple-200 border-purple-400 shadow-sm' : 'bg-gray-900/60 text-purple-400 border-gray-700 hover:bg-purple-900/40',
                    'focus:ring-2 focus:ring-purple-400 focus:ring-offset-2'
                ]" @click="showHeaders = !showHeaders" tabindex="0">
                    <span class="inline-flex items-center gap-1">
                        <svg v-if="showHeaders" class="h-3 w-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        Headers
                    </span>
                </button>
            </div>
            <!-- Toggle Content -->
            <div v-if="showBody">
                <pre
                    class="bg-gray-900/80 rounded-xl p-4 text-green-400 text-sm mb-2 overflow-auto w-full transition-all duration-200 font-mono border border-cyan-400">{{ response.body }}</pre>
                <div
                    class="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center text-xs text-cyan-300">
                    <span>Status: <span class="text-blue-400 font-bold">{{ response.status }}</span></span>
                    <span>Time: <span class="text-green-400">{{ response.time }} ms</span></span>
                    <span>Size: <span class="text-yellow-400">{{ response.size }} bytes</span></span>
                </div>
            </div>
            <div v-if="showHeaders">
                <label for="response-headers" class="font-semibold text-purple-400 mb-1 block">Headers:</label>
                <pre id="response-headers"
                    class="bg-gray-900/80 p-3 rounded-xl border border-purple-400 overflow-x-auto text-xs text-purple-300 transition-all duration-200 font-mono"
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
