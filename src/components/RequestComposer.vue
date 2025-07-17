<template>
    <form @submit.prevent="onSend"
        class="bg-[#272822] backdrop-blur-xl rounded-xl shadow-md border border-[#f92672] w-full max-w-xl mx-auto space-y-6 transition-all duration-200 animate-fade-in font-inter">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <select v-model="localRequest.method"
                class="bg-[#272822] border border-[#a6e22e] text-[#a6e22e] text-base rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#a6e22e] transition-all duration-200 font-semibold shadow-md">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
            </select>
            <input v-model="localRequest.url" type="text" placeholder="Enter URL"
                class="flex-1 bg-[#272822] border border-[#fd971f] text-[#fd971f] px-4 py-2 rounded-xl text-base focus:ring-2 focus:ring-[#fd971f] transition-all duration-200 font-mono shadow-md" />
            <button type="submit"
                class="px-4 py-2 rounded-lg text-[#a6e22e] font-semibold text-sm border border-[#a6e22e] bg-[#272822] hover:bg-[#49483e] hover:text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#a6e22e] focus:ring-offset-2 transition-all duration-150 shadow-sm"
                aria-label="Send Request">
                <span class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4 text-[#a6e22e]" fill="none" stroke="currentColor" stroke-width="2"
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
                class="w-full bg-[#272822] text-base text-[#66d9ef] font-mono border border-[#66d9ef] rounded-xl p-3 h-20 focus:ring-2 focus:ring-[#66d9ef] transition-all duration-200 resize-y shadow-md"
                placeholder='{ "Content-Type": "application/json" }' aria-label="Request headers"></textarea>
        </div>
        <div>
            <label for="body-input" class="block text-[#f92672] text-base font-semibold mb-2">Body
                <span class="text-xs text-[#f92672] ml-2" title="Enter JSON body for POST/PUT requests">(JSON
                    only)</span>
            </label>
            <textarea id="body-input" v-model="localRequest.body"
                class="w-full bg-[#272822] text-base text-[#f92672] font-mono border border-[#f92672] rounded-xl p-3 h-32 focus:ring-2 focus:ring-[#f92672] transition-all duration-200 resize-y shadow-md"
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
