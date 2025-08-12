<template>
    <aside class="bg-[#18181B] border-r border-zinc-800 w-full md:w-64 flex flex-col p-3 sm:p-4 gap-4 min-h-0">
        <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-bold text-white">Collections</h3>
            <button @click="showAdd = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold shadow">Add</button>
        </div>
        <ul class="space-y-2">
            <li v-for="col in collections" :key="col.id" class="flex items-center justify-between group">
                <button @click="setActive(col.id)"
                    :class="['text-left flex-1 px-2 py-1 rounded', col.id === activeCollectionId ? 'bg-blue-700 text-white' : 'bg-[#23272A] text-gray-200 hover:bg-blue-800']">
                    {{ col.name }}
                </button>
                <button @click="remove(col.id)"
                    class="ml-2 text-xs text-red-400 opacity-0 group-hover:opacity-100">✕</button>
            </li>
        </ul>
        <ul class="space-y-2" role="list" aria-label="Collections List">
            <li v-for="col in collections" :key="col.id" class="flex items-center justify-between group">
                <button @click="setActive(col.id)"
                    :class="['text-left flex-1 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150', col.id === activeCollectionId ? 'bg-blue-700 text-white' : 'bg-[#23272A] text-gray-200 hover:bg-blue-800']"
                    aria-label="Select collection: {{ col.name }}" tabindex="0">
                    {{ col.name }}
                </button>
                <button @click="remove(col.id)"
                    class="ml-2 text-xs text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-150"
                    aria-label="Remove collection: {{ col.name }}" tabindex="0">✕</button>
            </li>
        </ul>
        <div v-if="showAdd" class="mt-4">
            <input v-model="newName" placeholder="Collection name"
                class="w-full px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white mb-2 min-w-[120px]"
                aria-label="Collection Name" title="Enter new collection name" />
            <div class="flex gap-2">
                <button @click="add"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                    :disabled="!newName.trim()" aria-label="Create Collection"
                    title="Create new collection">Create</button>
                <button @click="showAdd = false"
                    class="bg-gray-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
            </div>
        </div>
        <div class="flex gap-2 mt-2">
            <button @click="exportCollections"
                class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold shadow"
                aria-label="Export Collections" title="Export all collections">Export</button>
            <input type="file" @change="importCollections" accept="application/json" class="hidden" ref="importInput" />
            <button @click="triggerImport"
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs font-semibold shadow"
                aria-label="Import Collections" title="Import collections from file">Import</button>
        </div>
        <div v-if="showImportError" class="text-red-400 text-xs mt-2">{{ importErrorMsg }}</div>
    </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const collections = computed(() => store.collections);
const activeCollectionId = computed(() => store.activeCollectionId);
const showAdd = ref(false);
const newName = ref('');
const importInput = ref(null);
const showImportError = ref(false);
const importErrorMsg = ref('');

function add() {
    if (!newName.value.trim()) return;
    store.addCollection({
        id: Date.now().toString(),
        name: newName.value.trim(),
        requests: []
    });
    newName.value = '';
    showAdd.value = false;
}
function remove(id) {
    store.removeCollection(id);
}
function setActive(id) {
    store.setActiveCollection(id);
}
function exportCollections() {
    const dataStr = JSON.stringify(collections.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collections.json';
    a.click();
    URL.revokeObjectURL(url);
}
function triggerImport() {
    importInput.value.click();
}
function importCollections(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const imported = JSON.parse(ev.target.result);
            if (!Array.isArray(imported)) throw new Error('Invalid format');
            imported.forEach(col => {
                if (!col.id) col.id = Date.now().toString() + Math.random();
                store.addCollection(col);
            });
            showImportError.value = false;
        } catch (err) {
            showImportError.value = true;
            importErrorMsg.value = 'Import failed: ' + (err.message || 'Invalid file');
        }
    };
    reader.readAsText(file);
}

watch(collections, (cols) => {
    localStorage.setItem('unsaved_collections', JSON.stringify(cols));
}, { deep: true });

onMounted(() => {
    const savedCols = localStorage.getItem('unsaved_collections');
    if (savedCols) {
        try {
            const cols = JSON.parse(savedCols);
            if (Array.isArray(cols) && cols.length) {
                cols.forEach(col => {
                    if (!collections.value.find(c => c.id === col.id)) {
                        store.addCollection(col);
                    }
                });
            }
        } catch { }
    }
});
</script>
