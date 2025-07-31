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
        <!-- Tabs -->
        <div class="mt-4">
            <div class="flex gap-2 mb-4">
                <button v-for="tab in tabs" :key="tab" type="button" @click="activeTab = tab" :class="[
                    'px-5 py-2 rounded-full font-semibold text-sm focus:outline-none transition-all duration-150',
                    activeTab === tab
                        ? 'bg-[#23272e] text-[#a6e22e] shadow-md relative z-10'
                        : 'bg-[#23272e]/70 text-[#f8f8f2]/80 border border-transparent opacity-70 hover:opacity-100 hover:text-[#a6e22e] hover:border-[#a6e22e] hover:shadow-lg'
                ]">
                    <span class="relative">
                        {{ tab }}
                        <span v-if="activeTab === tab"
                            class="absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-[#a6e22e] shadow-[0_0_8px_2px_#a6e22e] animate-fade-in"></span>
                    </span>
                </button>
            </div>
            <div v-if="activeTab === 'Params'">
                <ParamsEditor v-model="params" />
            </div>
            <div v-else-if="activeTab === 'Authorization'">
                <AuthEditor v-model="auth" />
            </div>
            <div v-else-if="activeTab === 'Headers'">
                <HeadersEditor v-model="localRequest.headers" />
            </div>
            <div v-else-if="activeTab === 'Body'">
                <BodyEditor v-model="localRequest.body" />
            </div>
        </div>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import ParamsEditor from './ParamsEditor.vue';
import AuthEditor from './AuthEditor.vue';
import HeadersEditor from './HeadersEditor.vue';
import BodyEditor from './BodyEditor.vue';

// Accept initialRequest as a prop
const props = defineProps({
    initialRequest: {
        type: Object,
        default: () => ({ method: 'GET', url: '', headers: {}, body: '' })
    }
});

// Local copy of the request for editing
const localRequest = ref({ ...props.initialRequest });

// Tabs
const tabs = ['Params', 'Authorization', 'Headers', 'Body'];
const activeTab = ref('Params');

// Params and Auth state
const params = ref([]); // [{ key: '', value: '' }]
const auth = ref('');

// Emit send event with the current request when the form is submitted
const emit = defineEmits(['send']);
function onSend() {
    // Build query string from params
    const query = (params.value || [])
        .filter(p => p.key)
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&');
    let url = localRequest.value.url || '';
    if (query) {
        url = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
    }
    emit('send', { ...localRequest.value, url });
}
</script>
