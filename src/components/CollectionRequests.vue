<template>
    <section class="bg-[#23272A] rounded-2xl shadow-xl p-4 border border-zinc-800 min-h-0 h-full flex flex-col">
        <h3 class="text-lg font-bold text-white mb-4">Requests in Collection</h3>
        <ul class="space-y-2 flex-1 overflow-auto">
            <li v-for="req in requests" :key="req.id"
                class="flex items-center justify-between group bg-[#18181B] rounded-lg px-3 py-2" draggable="true"
                @dragstart="onDragStart(req.id)" @dragover.prevent @drop="onDrop(req.id)">
                <div class="flex-1 flex items-center gap-2">
                    <button v-if="editId !== req.id" @click="load(req)"
                        class="text-left flex-1 text-blue-400 font-mono hover:underline">{{ req.name || req.url
                        }}</button>
                    <input v-else v-model="editName"
                        class="flex-1 px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white" />
                </div>
                <div class="flex gap-2">
                    <button v-if="editId !== req.id" @click="startEdit(req)"
                        class="text-xs text-gray-400 hover:text-blue-400">Edit</button>
                    <button v-if="editId === req.id" @click="saveEdit(req)" class="text-xs text-green-400">Save</button>
                    <button v-if="editId === req.id" @click="cancelEdit" class="text-xs text-gray-400">Cancel</button>
                    <button @click="remove(req.id)"
                        class="text-xs text-red-400 opacity-0 group-hover:opacity-100">✕</button>
                </div>
            </li>
        </ul>

        <div class="mt-4">
            <input v-model="newName" placeholder="Request name"
                class="w-full px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white mb-2" />
            <button @click="add"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">Add
                Request</button>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
const activeCollection = computed(() => store.collections.find(c => c.id === store.activeCollectionId));
const requests = computed(() => activeCollection.value ? activeCollection.value.requests : []);
const newName = ref('');
const editId = ref(null);
const editName = ref('');
let dragIdx = null;

function add() {
    if (!newName.value.trim()) return;
    store.addRequestToCollection(store.activeCollectionId, {
        id: Date.now().toString(),
        name: newName.value.trim(),
        ...store.currentRequest
    });
    newName.value = '';
}
function remove(id) {
    store.removeRequestFromCollection(store.activeCollectionId, id);
}
function load(req) {
    store.setRequest({ ...req });
}
function startEdit(req) {
    editId.value = req.id;
    editName.value = req.name || '';
}
function saveEdit(req) {
    if (!editName.value.trim()) return;
    req.name = editName.value.trim();
    editId.value = null;
    editName.value = '';
}
function cancelEdit() {
    editId.value = null;
    editName.value = '';
}
function onDragStart(idx) {
    dragIdx = idx;
}
function onDrop(idx) {
    if (dragIdx === null || dragIdx === idx) return;
    const arr = requests.value;
    const moved = arr.splice(dragIdx, 1)[0];
    arr.splice(idx, 0, moved);
    dragIdx = null;
}
</script>
