<template>
    <div v-if="response"
        class="bg-[#23272A] border border-zinc-800 rounded-2xl p-4 md:p-6 text-base text-gray-200 font-mono flex-1 min-h-0 overflow-auto shadow-xl transition-colors duration-200 animate-fade-in">
        <pre
            class="bg-[#18181B] rounded-lg p-3 text-green-400 text-sm mb-2 overflow-auto w-full transition-all duration-200">{{ response.body }}</pre>
        <div class="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center text-xs text-gray-400">
            <span>Status: <span class="text-blue-400 font-bold">{{ response.status }}</span></span>
            <span>Time: <span class="text-green-400">{{ response.time }} ms</span></span>
            <span>Size: <span class="text-yellow-400">{{ response.size }} bytes</span></span>
        </div>
        <div class="mt-4">
            <label for="response-headers" class="font-semibold text-gray-300 mb-1 block">Headers:</label>
            <pre id="response-headers"
                class="bg-[#18181B] p-2 rounded-lg border border-zinc-700 overflow-x-auto text-xs text-gray-400 transition-all duration-200"
                aria-label="Response headers">{{ response.headers }}</pre>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const response = computed(() => store.response);
</script>
