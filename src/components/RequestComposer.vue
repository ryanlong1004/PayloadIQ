<template>
    <form @submit.prevent="onSend"
        class="bg-[#23272A] p-4 md:p-6 rounded-2xl shadow-xl w-full max-w-xl mx-auto space-y-6 transition-colors duration-200 animate-fade-in font-inter">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select v-model="localRequest.method"
                class="bg-[#2C2C2C] border border-zinc-700 text-white text-base rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-semibold">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
            </select>
            <input v-model="localRequest.url" type="text" placeholder="Enter URL"
                class="flex-1 bg-[#2C2C2C] border border-zinc-700 text-white px-4 py-2 rounded text-base focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-normal" />
            <button type="submit"
                class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-lg text-base font-bold shadow transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Send
                Request</button>
        </div>
        <div>
            <label for="headers-input" class="block text-gray-300 text-base font-semibold mb-2">Headers
                <span class="text-xs text-gray-400 ml-2" title="Add custom headers as JSON">(e.g., {'Content-Type':
                    'application/json'})</span>
            </label>
            <textarea id="headers-input" v-model="localRequest.headers"
                class="w-full bg-[#2C2C2C] text-base text-gray-200 font-mono border border-zinc-700 rounded-lg p-3 h-20 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-y"
                placeholder='{ "Content-Type": "application/json" }' aria-label="Request headers"></textarea>
        </div>
        <div>
            <label for="body-input" class="block text-gray-300 text-base font-semibold mb-2">Body
                <span class="text-xs text-gray-400 ml-2" title="Enter JSON body for POST/PUT requests">(JSON
                    only)</span>
            </label>
            <textarea id="body-input" v-model="localRequest.body"
                class="w-full bg-[#2C2C2C] text-base text-gray-200 font-mono border border-zinc-700 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-y"
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
