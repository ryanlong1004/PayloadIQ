<template>
    <div class="space-y-3 animate-fade-in">
        <ul>
            <li v-for="item in history" :key="item.id"
                class="flex justify-between items-center bg-[#18181B] rounded-lg px-4 py-3 mb-2 shadow border border-zinc-800 transition-colors duration-200 hover:bg-[#23272A]">
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
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold shadow transition-colors duration-200">Load</button>
            </li>
        </ul>
        <div v-if="!history.length" class="text-gray-500 text-base italic flex items-center gap-2 mt-4">
            <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            No requests yet.
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({ history: Array });
const history = ref([]);

watch(() => props.history, (val) => {
    history.value = val || [];
}, { immediate: true });
</script>
