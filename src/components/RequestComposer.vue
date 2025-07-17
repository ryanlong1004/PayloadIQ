<template>
    <form @submit.prevent="onSend"
        class="bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-md border border-cyan-400 w-full max-w-xl mx-auto space-y-6 transition-all duration-200 animate-fade-in font-inter">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select v-model="localRequest.method"
                class="bg-gray-900/80 border border-cyan-400 text-cyan-300 text-base rounded-xl px-3 py-2 focus:ring-2 focus:ring-cyan-500 transition-all duration-200 font-semibold shadow-md">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
            </select>
            <input v-model="localRequest.url" type="text" placeholder="Enter URL"
                class="flex-1 bg-gray-900/80 border border-cyan-400 text-green-400 px-4 py-2 rounded-xl text-base focus:ring-2 focus:ring-cyan-500 transition-all duration-200 font-mono shadow-md" />
            <button type="submit"
                class="px-4 py-2 rounded-lg text-cyan-100 font-semibold text-sm border border-cyan-400 bg-cyan-900/70 hover:bg-cyan-800/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all duration-150 shadow-sm"
                aria-label="Send Request">
                <span class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Send Request
                </span>
            </button>
        </div>
        <div>
            <label for="headers-input" class="block text-cyan-400 text-base font-semibold mb-2">Headers
                <span class="text-xs text-cyan-300 ml-2" title="Add custom headers as JSON">(e.g., {'Content-Type':
                    'application/json'})</span>
            </label>
            <textarea id="headers-input" v-model="localRequest.headers"
                class="w-full bg-gray-900/80 text-base text-green-400 font-mono border border-cyan-400 rounded-xl p-3 h-20 focus:ring-2 focus:ring-cyan-500 transition-all duration-200 resize-y shadow-md"
                placeholder='{ "Content-Type": "application/json" }' aria-label="Request headers"></textarea>
        </div>
        <div>
            <label for="body-input" class="block text-purple-400 text-base font-semibold mb-2">Body
                <span class="text-xs text-purple-300 ml-2" title="Enter JSON body for POST/PUT requests">(JSON
                    only)</span>
            </label>
            <textarea id="body-input" v-model="localRequest.body"
                class="w-full bg-gray-900/80 text-base text-purple-300 font-mono border border-purple-400 rounded-xl p-3 h-32 focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-y shadow-md"
                placeholder="JSON body" aria-label="Request body"></textarea>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const emit = defineEmits(['send']);
const localRequest = ref({ ...store.currentRequest });

watch(() => store.currentRequest, (val) => {
    if (val) localRequest.value = { ...val };
}, { immediate: true });

const onSend = () => {
    emit('send', { ...localRequest.value });
};
</script>
