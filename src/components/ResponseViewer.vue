<template>
    <div v-if="response"
        class="border border-purple-400 rounded-xl p-6 text-base text-gray-200 font-mono flex-1 min-h-0 overflow-auto shadow-md transition-all duration-200 animate-fade-in bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-xl">
        <div>
            <pre
                class="bg-gray-900/80 rounded-xl p-4 text-green-400 text-sm mb-2 overflow-auto w-full transition-all duration-200 font-mono border border-cyan-400">{{ response.body }}</pre>
            <div
                class="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center text-xs text-cyan-300">
                <span>Status: <span class="text-blue-400 font-bold">{{ response.status }}</span></span>
                <span>Time: <span class="text-green-400">{{ response.time }} ms</span></span>
                <span>Size: <span class="text-yellow-400">{{ response.size }} bytes</span></span>
            </div>
            <div class="mt-4">
                <label for="response-headers" class="font-semibold text-purple-400 mb-1 block">Headers:</label>
                <pre id="response-headers"
                    class="bg-gray-900/80 p-3 rounded-xl border border-purple-400 overflow-x-auto text-xs text-purple-300 transition-all duration-200 font-mono"
                    aria-label="Response headers">{{ response.headers }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const response = computed(() => store.response);
</script>
