<template>
    <div class="h-full min-h-0 w-full min-w-0 px-2 md:px-0 grid gap-4 overflow-x-auto"
        style="grid-template-columns: repeat(12, 1fr); grid-template-rows: minmax(45vh, 45vh) minmax(45vh, 45vh) minmax(20vh, 1fr) minmax(20vh, 1fr); background-color: #1b1b1b;">
        <!-- Request Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#f92672] h-full min-h-[40vh] transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="request-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="request-pane-header" class="text-lg md:text-xl font-bold text-cyan-400">Request</h2>
            </div>
            <div v-if="!collapsed.request" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <RequestComposer :initialRequest="currentRequest" @send="sendRequest" />
            </div>
        </section>
        <!-- Response Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#a6e22e] h-full min-h-[40vh] transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="response-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="response-pane-header"
                    class="text-lg md:text-xl font-bold text-purple-400 drop-shadow-[0_0_8px_purple]">Response</h2>
            </div>
            <!-- Persistent Response Info Bar -->
            <div class="flex gap-2 items-center px-6 pb-2">
                <span v-if="response && response.status !== undefined"
                    class="inline-block px-2 py-1 rounded-full bg-green-900 text-green-300 text-xs font-bold border border-green-400 shadow">Status:
                    {{ response.status }}</span>
                <span v-if="response && response.time !== undefined"
                    class="inline-block px-2 py-1 rounded-full bg-blue-900 text-blue-300 text-xs font-bold border border-blue-400 shadow">Time:
                    {{ response.time }} ms</span>
                <span v-if="response && response.size !== undefined"
                    class="inline-block px-2 py-1 rounded-full bg-pink-900 text-pink-300 text-xs font-bold border border-pink-400 shadow">Size:
                    {{ response.size }} bytes</span>
            </div>
            <div v-if="!collapsed.response" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <template v-if="loading">
                    <div class="text-center text-cyan-400 py-8 animate-pulse">Loading...</div>
                </template>
                <template v-else-if="error">
                    <div class="text-center text-red-400 py-8 animate-shake">{{ error }}</div>
                </template>
                <template v-else>
                    <ResponseViewer :response="{ ...response, status: undefined, time: undefined, size: undefined }" />
                </template>
            </div>
        </section>
        <!-- History Pane -->
        <section
            class="bg-[#272822] rounded-xl shadow-2xl border border-[#fd971f] h-full min-h-[40vh] overflow-y-auto transition-all duration-300 ease-in-out backdrop-blur-xl p-0 flex flex-col max-w-full col-span-6"
            aria-labelledby="history-pane-header">
            <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <h2 id="history-pane-header" class="text-lg md:text-xl font-bold text-[#fd971f]">History</h2>
            </div>
            <div v-if="!collapsed.history" class="flex-1 flex flex-col min-h-0 px-6 pb-6 overflow-auto">
                <ul class="space-y-2 overflow-x-auto">
                    <li v-for="item in store.history" :key="item.id"
                        class="flex items-center gap-2 bg-[#49483e]/70 hover:bg-[#49483e]/90 rounded-lg px-3 py-2 transition-colors duration-150 cursor-pointer border-l-4 border-transparent hover:border-[#a6e22e] w-full flex-grow"
                        tabindex="0" role="button"
                        aria-label="History item: {{ item.method }} {{ item.endpoint }} at {{ item.time }}"
                        @keydown.enter="selectHistory(item)" @keydown.space.prevent="selectHistory(item)"
                        @click="selectHistory(item)">
                        <span class="font-mono text-xs text-[#a6e22e]">{{ item.method }}</span>
                        <span class="truncate text-xs text-[#f8f8f2]">{{ item.endpoint }}</span>
                        <span class="ml-auto text-xs text-[#fd971f] opacity-70">{{ item.time }}</span>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
// ...existing code...
</script>
