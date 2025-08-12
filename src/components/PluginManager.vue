<template>
    <section class="bg-[#23272A] rounded-2xl shadow-xl p-4 border border-zinc-800 min-h-0 w-full flex flex-col gap-4">
        <h3 class="text-lg font-bold text-white mb-2">Plugin Manager</h3>
        <ul class="space-y-2">
            <li v-for="plugin in plugins" :key="plugin.name" class="flex items-center justify-between group">
                <span class="text-left flex-1 px-2 py-1 rounded text-gray-200">{{ plugin.name }}</span>
                <button @click="toggle(plugin)" class="ml-2 text-xs text-blue-400">
                    {{ plugin.enabled ? 'Disable' : 'Enable' }}
                </button>
            </li>
        </ul>
        <div class="mt-4">
            <input v-model="pluginUrl" placeholder="Plugin URL or file path"
                class="w-full px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white mb-2" />
            <button @click="installPlugin" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">Install Plugin</button>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { plugins, registerPlugin } from '../utils/pluginLoader';

const pluginUrl = ref('');

function installPlugin() {
    // For demo: just register a dummy plugin
    const dummy = {
        name: pluginUrl.value,
        enabled: true,
        install(app, store) {
            // Plugin logic here
        }
    };
    registerPlugin(dummy);
    pluginUrl.value = '';
}

function toggle(plugin) {
    plugin.enabled = !plugin.enabled;
}
</script>
