<template>
    <section class="flex flex-col md:flex-row gap-8 h-full min-h-0 w-full">
        <div
            class="flex-1 flex flex-col bg-[#23272A] rounded-2xl shadow-xl p-6 border border-zinc-800 min-h-0 h-full justify-start">
            <h2 class="text-lg font-bold text-white mb-4">Request</h2>
            <div class="flex-1 flex flex-col min-h-0">
                <RequestComposer :initialRequest="currentRequest" @send="handleSend" />
            </div>
        </div>
        <div
            class="flex-1 flex flex-col bg-[#23272A] rounded-2xl shadow-xl p-6 border border-zinc-800 min-h-0 h-full justify-start overflow-auto">
            <h2 class="text-lg font-bold text-white mb-4">Response</h2>
            <div class="flex-1 flex flex-col min-h-0 overflow-auto">
                <ResponseViewer :response="response" />
            </div>
        </div>
        <div
            class="flex-1 flex flex-col bg-[#23272A] rounded-2xl shadow-xl p-6 border border-zinc-800 min-h-0 h-full justify-start">
            <h2 class="text-lg font-bold text-white mb-4">History</h2>
            <div class="flex-1 flex flex-col min-h-0">
                <RequestHistory :history="history" @load="loadRequest" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import RequestComposer from '../components/RequestComposer.vue';
import ResponseViewer from '../components/ResponseViewer.vue';
import RequestHistory from '../components/RequestHistory.vue';
import { sendHttpRequest } from '../utils/api';
import { saveRequest, loadHistory } from '../utils/storage';

const response = ref(null);
const currentRequest = ref({ url: '', method: 'GET', headers: '', body: '' });
const history = ref([]);

const handleSend = async (request) => {
    response.value = null;
    const res = await sendHttpRequest(request);
    response.value = res;
    saveRequest(request);
    history.value = loadHistory();
};

const loadRequest = (item) => {
    currentRequest.value = { ...item };
};

// Sync history on mount
history.value = loadHistory();
</script>
