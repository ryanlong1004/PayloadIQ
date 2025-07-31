<template>
    <div class="bg-[#1a1d23] rounded-2xl shadow-lg p-4 md:p-6" role="region" aria-labelledby="auth-section-header">
        <div class="mb-4 flex items-center justify-between">
            <div>
                <h3 id="auth-section-header" class="text-[#66d9ef] text-lg font-bold tracking-wide mb-1">Authorization
                </h3>
                <div class="text-[#66d9ef] text-xs mb-2 opacity-80">
                    <slot name="description">Add Authorization header or credentials.</slot>
                </div>
            </div>
        </div>
        <AuthInputRow :value="modelValue" :placeholder="placeholder" @input="onInput" @copy="copyAuth" />
        <div v-if="modelValue" class="mt-2 text-[#a6e22e] text-xs font-mono">Header: <b>Authorization</b></div>
    </div>
</template>

<script setup>
/**
 * AuthEditor component
 * @prop {String} modelValue - The authorization value (v-model)
 * @prop {String} placeholder - Input placeholder
 * @emits update:modelValue - When auth changes
 */
import { defineProps, defineEmits } from 'vue';
import AuthInputRow from './AuthInputRow.vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Bearer token or Basic credentials'
    }
});
const emit = defineEmits(['update:modelValue']);

function onInput(e) {
    emit('update:modelValue', e.target.value);
}
function copyAuth() {
    if (props.modelValue) {
        navigator.clipboard?.writeText(props.modelValue);
    }
}
</script>
