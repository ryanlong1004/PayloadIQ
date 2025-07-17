// src/composables/useToast.js
import { ref } from 'vue';

const toastMessage = ref('');
const toastType = ref('info');
const toastVisible = ref(false);
let timeoutId = null;

function showToast(message, type = 'info', duration = 2500) {
    toastMessage.value = message;
    toastType.value = type;
    toastVisible.value = true;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        toastVisible.value = false;
    }, duration);
}

export function useToast() {
    return {
        toastMessage,
        toastType,
        toastVisible,
        showToast,
    };
}
