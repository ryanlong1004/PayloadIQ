<template>
    <button @click="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        class="fixed top-4 right-4 z-50 bg-[#23272A] border border-zinc-700 rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors duration-200">
        <span v-if="theme === 'dark'">
            <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M4.05 19.95l-.71-.71" />
            </svg>
        </span>
        <span v-else>
            <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
        </span>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const theme = ref('dark');

function setTheme(val) {
    theme.value = val;
    document.documentElement.classList.toggle('dark', val === 'dark');
    localStorage.setItem('theme', val);
}
function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
    const saved = localStorage.getItem('theme');
    setTheme(saved || 'dark');
});
</script>

<style scoped>
:root.dark {
    --bg: #18181B;
    --panel: #23272A;
    --text: #fff;
}

:root:not(.dark) {
    --bg: #f8fafc;
    --panel: #fff;
    --text: #23272A;
}
</style>
