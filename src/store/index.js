// Simple store for MVP (can be replaced with Pinia later)
import { reactive } from 'vue';

export const state = reactive({
    response: null,
    history: []
});
