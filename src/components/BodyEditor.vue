<template>
    <div class="bg-[#1a1d23] rounded-2xl shadow-lg p-4 md:p-6" role="region" aria-labelledby="body-section-header">
        <div class="mb-4 flex items-center justify-between">
            <div>
                <h3 id="body-section-header" class="text-[#f92672] text-lg font-bold tracking-wide mb-1">Body</h3>
                <div class="text-[#f92672] text-xs mb-2 opacity-80">
                    <slot name="description">Enter JSON body for POST/PUT requests.</slot>
                </div>
            </div>
            <button v-if="modelValue" @click="copyBody" type="button"
                class="ml-2 px-2 py-1 rounded border border-[#f92672] text-[#f92672] bg-[#23272e] hover:bg-[#f92672] hover:text-[#23272e] focus:bg-[#f92672] focus:text-[#23272e] text-xs font-mono transition-colors duration-150"
                aria-label="Copy body" title="Copy to clipboard">
                Copy
            </button>
        </div>
        <textarea :value="modelValue" @input="onInput" :class="['w-full bg-[#272822] text-base text-[#f92672] font-mono border rounded-xl p-3 h-32 focus:ring-2 transition-all duration-200 resize-y shadow-md',
            isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-[#f92672] focus:ring-[#f92672]']"
            placeholder="JSON body" aria-label="Request body" spellcheck="false" autocomplete="off"></textarea>
        <div v-if="isInvalid" class="mt-2 text-red-400 text-xs font-mono">Invalid JSON</div>
    </div>
</template>

<script setup>
/**
 * BodyEditor component
 * @prop {String} modelValue - The body JSON string (v-model)
 * @emits update:modelValue - When body changes
 */
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['update:modelValue']);

import { computed } from 'vue';

const isInvalid = computed(() => {
    if (!props.modelValue.trim()) return false;
    try {
        JSON.parse(props.modelValue);
        return false;
    } catch {
        return true;
    }
});

function onInput(e) {
    emit('update:modelValue', e.target.value);
}
function copyBody() {
    if (props.modelValue) {
        navigator.clipboard?.writeText(props.modelValue);
    }
}
</script>
