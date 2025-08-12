<template>
    <div class="space-y-3 animate-fade-in">
        <input v-model="searchTerm" type="text" placeholder="Search history"
            class="w-full px-3 py-2 rounded border border-zinc-700 bg-[#23272A] text-white mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150 min-w-[120px]"
            aria-label="Search History" title="Search request history" />
        <ul role="list" aria-label="Request History List">
            <li v-for="item in filteredHistory" :key="item.id"
                class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-[#18181B] rounded-lg px-3 md:px-4 py-2 md:py-3 mb-2 shadow border border-zinc-800 transition-colors duration-200 hover:bg-[#23272A] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                tabindex="0" aria-label="History item: {{ item.method }} {{ item.url }}" role="button">
                <span class="font-mono text-base text-gray-200 flex items-center gap-2">
                    <svg class="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1h3" />
                    </svg>
                    <span class="font-bold text-green-400">{{ item.method }}</span> <span class="text-blue-400">{{
                        item.url }}</span>
                </span>
                <button @click="$emit('load', item)"
                    class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold shadow transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2 sm:mt-0"
                    aria-label="Load request: {{ item.method }} {{ item.url }}">Load</button>
            </li>
        </ul>
        <div v-if="!filteredHistory.length" class="text-gray-500 text-base italic flex items-center gap-2 mt-4">
            <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            No requests found.
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const history = computed(() => store.history);
const search = ref('');
const debouncedSearch = ref('');
let searchTimeout = null;
watch(search, (val) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        debouncedSearch.value = val;
    }, 200);
});
const filteredHistory = computed(() => {
    if (!debouncedSearch.value.trim()) return history.value;
    const q = debouncedSearch.value.trim().toLowerCase();
    return history.value.filter(item =>
        item.url?.toLowerCase().includes(q) || item.method?.toLowerCase().includes(q)
    );
});
</script>
