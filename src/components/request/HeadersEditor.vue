<template>
    <div class="bg-[#1a1d23] rounded-2xl shadow-lg p-4 md:p-6" role="region" aria-labelledby="headers-section-header">
        <div class="mb-4">
            <h3 id="headers-section-header" class="text-[#66d9ef] text-lg font-bold tracking-wide mb-1">Headers</h3>
            <div class="text-[#66d9ef] text-xs mb-2 opacity-80">
                <slot name="description">Custom headers as JSON. <span class='font-mono'>{"Content-Type":
                        "application/json"}</span></slot>
            </div>
        </div>
        <textarea :value="modelValue" @input="onInput"
            class="w-full bg-[#23272e] text-base text-[#66d9ef] font-mono border border-[#66d9ef] rounded-xl p-3 h-20 focus:ring-2 focus:ring-[#66d9ef] transition-all duration-200 resize-y shadow-md"
            placeholder='{ "Content-Type": "application/json" }' aria-label="Request headers" spellcheck="false"
            autocomplete="off"></textarea>
    </div>
</template>

<script setup>
/**
 * HeadersEditor component
 * @prop {String} modelValue - The headers JSON string (v-model)
 * @emits update:modelValue - When headers change
 */
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['update:modelValue']);

function onInput(e) {
    emit('update:modelValue', e.target.value);
}
</script>
