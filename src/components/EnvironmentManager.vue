<template>
    <section class="bg-[#23272A] rounded-2xl shadow-xl p-4 border border-zinc-800 min-h-0 w-full flex flex-col gap-4">
        <h3 class="text-lg font-bold text-white mb-2">Environments</h3>
        <div class="flex gap-2 mb-4">
            <select v-model="activeId" @change="setActive"
                class="px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Select Environment">
                <option v-for="env in environments" :key="env.id" :value="env.id">{{ env.name }}</option>
            </select>
            <button @click="showAdd = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Add Environment">Add</button>
            <button @click="duplicateEnv" :disabled="!activeEnv"
                class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold shadow focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Duplicate Environment">Duplicate</button>
            <button @click="exportEnv" :disabled="!activeEnv"
                class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Export Environment">Export</button>
            <input type="file" @change="importEnv" accept="application/json" class="hidden" ref="importInput" />
            <button @click="triggerImport"
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-150"
                aria-label="Import Environment">Import</button>
        </div>
        <div v-if="showAdd" class="mb-4">
            <input v-model="newName" placeholder="Environment name"
                class="w-full px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white mb-2 min-w-[120px]"
                aria-label="Environment Name" title="Enter new environment name" />
            <button @click="addEnv"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                :disabled="!newName.trim()" aria-label="Create Environment"
                title="Create new environment">Create</button>
            <button @click="showAdd = false" class="bg-gray-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
        </div>
        <div v-if="activeEnv" class="mt-2">
            <h4 class="text-base font-semibold text-white mb-2">Variables</h4>
            <ul class="space-y-2" role="list" aria-label="Environment Variables">
                <li v-for="(val, key) in activeEnv.variables" :key="key" class="flex items-center gap-2">
                    <span class="text-gray-200">{{ key }}:</span>
                    <input :type="isSecret(key) ? 'password' : 'text'" :value="activeEnv.variables[key]"
                        @input="updateVariable(key, $event.target.value)"
                        class="px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
                        aria-label="Variable Value: {{ key }}" />
                    <input :value="activeEnv.descriptions?.[key] || ''"
                        @input="updateDescription(key, $event.target.value)" placeholder="Description"
                        class="px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-gray-400 text-xs w-32 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
                        aria-label="Variable Description: {{ key }}" />
                    <button @click="toggleSecret(key)"
                        class="text-xs text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-150"
                        :title="isSecret(key) ? 'Unmask' : 'Mask as secret'" aria-label="Toggle Secret: {{ key }}">
                        <span v-if="isSecret(key)">&#128274;</span>
                        <span v-else>&#128065;</span>
                    </button>
                    <button @click="confirmRemoveVar(key)"
                        class="text-xs text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-150"
                        aria-label="Remove Variable: {{ key }}">&#10005;</button>
                </li>
            </ul>
            <div class="flex gap-2 mt-2">
                <input v-model="newVarKey" placeholder="Key"
                    class="px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white" />
                <input v-model="newVarVal" placeholder="Value"
                    class="px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white" />
                <input v-model="newVarDesc" placeholder="Description"
                    class="px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-gray-400 text-xs w-32" />
                <button @click="addVar"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold">Add</button>
                <button @click="showBulkEdit = true" class="bg-gray-700 text-white px-2 py-1 rounded text-xs">Bulk
                    Edit</button>
            </div>
            <!-- Bulk Edit Modal -->
            <div v-if="showBulkEdit" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div class="bg-[#23272A] rounded-xl p-6 w-[400px] shadow-2xl">
                    <h4 class="text-lg font-bold text-white mb-4">Bulk Edit Variables (key=value)</h4>
                    <textarea v-model="bulkEditText" rows="8"
                        class="w-full px-2 py-1 rounded border border-zinc-700 bg-[#23272A] text-white mb-4"></textarea>
                    <div class="flex gap-2 justify-end">
                        <button @click="applyBulkEdit"
                            class="bg-blue-600 text-white px-3 py-1 rounded text-xs">Apply</button>
                        <button @click="showBulkEdit = false"
                            class="bg-gray-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
                    </div>
                </div>
            </div>
            <!-- Confirm Delete Modal -->
            <div v-if="confirmDeleteKey" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div class="bg-[#23272A] rounded-xl p-6 w-[350px] shadow-2xl">
                    <h4 class="text-lg font-bold text-white mb-4">Delete Variable?</h4>
                    <p class="text-gray-300 mb-4">Are you sure you want to delete <span class="font-bold">{{
                        confirmDeleteKey }}</span>?</p>
                    <div class="flex gap-2 justify-end">
                        <button @click="removeVar(confirmDeleteKey); confirmDeleteKey = null;"
                            class="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                        <button @click="confirmDeleteKey = null"
                            class="bg-gray-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMainStore } from '../store';
const store = useMainStore();
const environments = computed(() => store.environments);
const activeId = ref(store.activeEnvironmentId);
const activeEnv = computed(() => environments.value.find(e => e.id === activeId.value));
const showAdd = ref(false);
const newName = ref('');
const newVarKey = ref('');
const newVarVal = ref('');
const newVarDesc = ref('');
const showBulkEdit = ref(false);
const bulkEditText = ref('');
const confirmDeleteKey = ref(null);
const importInput = ref(null);

function setActive() {
    store.setActiveEnvironment(activeId.value);
}
function addEnv() {
    if (!newName.value.trim()) return;
    store.addEnvironment({ id: Date.now().toString(), name: newName.value.trim(), variables: {}, descriptions: {}, secrets: [] });
    newName.value = '';
    showAdd.value = false;
}
function addVar() {
    if (!newVarKey.value.trim()) return;
    store.addVariable(activeId.value, newVarKey.value.trim(), newVarVal.value, false);
    // Update description safely
    const env = environments.value.find(e => e.id === activeId.value);
    if (env) {
        const descs = { ...(env.descriptions || {}) };
        descs[newVarKey.value.trim()] = newVarDesc.value;
        store.updateEnvironment(activeId.value, { descriptions: descs });
    }
    newVarKey.value = '';
    newVarVal.value = '';
    newVarDesc.value = '';
}
function removeVar(key) {
    store.removeVariable(activeId.value, key);
    const env = environments.value.find(e => e.id === activeId.value);
    if (env && env.descriptions) {
        const descs = { ...env.descriptions };
        delete descs[key];
        store.updateEnvironment(activeId.value, { descriptions: descs });
    }
}
function confirmRemoveVar(key) {
    confirmDeleteKey.value = key;
}

function isSecret(key) {
    return activeEnv.value?.secrets?.includes(key);
}
function toggleSecret(key) {
    store.setVariableSecret(activeId.value, key, !isSecret(key));
}
function duplicateEnv() {
    if (!activeEnv.value) return;
    const copy = JSON.parse(JSON.stringify(activeEnv.value));
    copy.id = Date.now().toString();
    copy.name += ' (Copy)';
    store.addEnvironment(copy);
}
function exportEnv() {
    if (!activeEnv.value) return;
    const dataStr = JSON.stringify(activeEnv.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeEnv.value.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
function triggerImport() {
    importInput.value.click();
}
function importEnv(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const env = JSON.parse(ev.target.result);
            env.id = Date.now().toString();
            store.addEnvironment(env);
        } catch {
            alert('Invalid environment file.');
        }
    };
    reader.readAsText(file);
}
// Bulk edit variables
function applyBulkEdit() {
    if (!activeEnv.value) return;
    const env = environments.value.find(e => e.id === activeId.value);
    if (!env) return;
    const descs = { ...(env.descriptions || {}) };
    const lines = bulkEditText.value.split('\n');
    lines.forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length) {
            store.addVariable(activeId.value, key.trim(), rest.join('=').trim(), false);
            descs[key.trim()] = descs[key.trim()] || '';
        }
    });
    store.updateEnvironment(activeId.value, { descriptions: descs });
    showBulkEdit.value = false;
    bulkEditText.value = '';
}
function updateVariable(key, value) {
    store.updateVariable(activeId.value, key, value);
}
function updateDescription(key, value) {
    const env = environments.value.find(e => e.id === activeId.value);
    if (env) {
        const descs = { ...(env.descriptions || {}) };
        descs[key] = value;
        store.updateEnvironment(activeId.value, { descriptions: descs });
    }
}

// Auto-save and recovery
watch(environments, (envs) => {
    localStorage.setItem('unsaved_environments', JSON.stringify(envs));
}, { deep: true });

onMounted(() => {
    const savedEnvs = localStorage.getItem('unsaved_environments');
    if (savedEnvs) {
        try {
            const envs = JSON.parse(savedEnvs);
            if (Array.isArray(envs) && envs.length) {
                envs.forEach(env => {
                    if (!environments.value.find(e => e.id === env.id)) {
                        store.addEnvironment(env);
                    }
                });
            }
        } catch { }
    }
});
</script>
