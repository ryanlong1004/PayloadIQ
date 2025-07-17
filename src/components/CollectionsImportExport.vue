<template>
    <section class="bg-[#23272A] rounded-2xl shadow-xl p-4 border border-zinc-800 min-h-0 w-full flex flex-col gap-4">
        <h3 class="text-lg font-bold text-white mb-2">Import/Export Collections</h3>
        <div class="flex gap-2">
            <button @click="exportCollections"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">Export</button>
            <input type="file" @change="importCollections" accept="application/json"
                class="bg-[#23272A] text-white px-2 py-1 rounded border border-zinc-700" />
        </div>
    </section>
</template>

<script setup>
import { useMainStore } from '../store';
const store = useMainStore();

function exportCollections() {
    const data = JSON.stringify(store.collections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collections.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importCollections(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                store.setCollections(imported);
            }
        } catch (err) {
            alert('Invalid file format');
        }
    };
    reader.readAsText(file);
}
</script>
