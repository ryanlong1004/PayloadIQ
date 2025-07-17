<template>
    <transition name="fade">
        <div v-if="toastVisible" :class="[
            'fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in',
            toastType === 'error' ? 'bg-red-700 text-white' : toastType === 'success' ? 'bg-green-700 text-white' : 'bg-blue-700 text-white'
        ]">
            <span>{{ toastMessage }}</span>
            <button @click="toastVisible = false" class="ml-2 text-xs text-white hover:text-gray-200">✕</button>
        </div>
    </transition>
</template>

<script setup>
import { useToast } from '../composables/useToast';
const { toastMessage, toastType, toastVisible } = useToast();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
