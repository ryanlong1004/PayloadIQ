<template>
    <aside class="bg-[#18181B] border-r border-zinc-800 w-full md:w-64 flex flex-col p-4 gap-4 min-h-0">
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
        <div v-if="showAdd" class="mt-4">
            <input v-model="newName" placeholder="Collection name"
                class="w-full px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white mb-2" />
            <div class="flex gap-2">
                <button @click="add"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">Create</button>
                <button @click="showAdd = false"
                    class="bg-gray-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const collections = computed(() => store.collections);
const activeCollectionId = computed(() => store.activeCollectionId);
const showAdd = ref(false);
const newName = ref('');

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
</script>
