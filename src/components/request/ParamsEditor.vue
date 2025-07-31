<template>
    <div class="bg-[#1a1d23] rounded-2xl shadow-lg p-4 md:p-6" role="region" aria-labelledby="params-section-header">
        <div class="mb-4">
            <h3 id="params-section-header" class="text-[#66d9ef] text-lg font-bold tracking-wide mb-1">Params</h3>
            <div class="text-[#66d9ef] text-xs mb-2 opacity-80">
                <slot name="description">Key/Value pairs to append as query params.</slot>
            </div>
        </div>
        <div class="space-y-3">
            <div v-for="(param, idx) in modelValue" :key="idx" class="flex gap-2 items-center">
                <input v-model="param.key" placeholder="Key"
                    class="flex-1 rounded-lg bg-[#23272e] border border-[rgba(102,217,239,0.4)] text-[#66d9ef] px-3 py-2 text-xs font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66d9ef] focus:border-[#66d9ef] transition-all duration-150"
                    :aria-label="`Parameter key ${idx + 1}`" @keydown.enter.prevent="focusNext(idx, 'key')"
                    @focus="emit('focus', idx, 'key')" @blur="emit('blur', idx, 'key')" />
                <span class="text-[#66d9ef] font-bold">:</span>
                <input v-model="param.value" placeholder="Value"
                    class="flex-1 rounded-lg bg-[#23272e] border border-[rgba(102,217,239,0.4)] text-[#66d9ef] px-3 py-2 text-xs font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66d9ef] focus:border-[#66d9ef] transition-all duration-150"
                    :aria-label="`Parameter value ${idx + 1}`" @keydown.enter.prevent="focusNext(idx, 'value')"
                    @focus="emit('focus', idx, 'value')" @blur="emit('blur', idx, 'value')" />
                <button type="button" @click="removeParam(idx)"
                    class="ml-1 px-2 py-1 rounded-full bg-transparent text-[#f92672] hover:bg-[#23272e] hover:text-[#f92672] focus:outline-none focus:ring-2 focus:ring-[#f92672] transition-all duration-150 text-lg"
                    :aria-label="`Remove parameter ${idx + 1}`">
                    &times;
                </button>
            </div>
        </div>
        <div class="mt-4 flex justify-end">
            <button type="button" @click="addParam"
                class="inline-flex items-center gap-1 text-xs font-semibold text-black bg-[#a6e22e] hover:bg-[#7ecb20] focus:bg-[#7ecb20] border-none rounded-full px-4 py-2 shadow-md transition-all duration-150 focus:outline-none"
                aria-label="Add parameter">
                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Param
            </button>
        </div>
    </div>
</template>

<script setup>
import { nextTick } from 'vue';

/**
 * ParamsEditor component
 * @prop {Array<{key: string, value: string}>} modelValue - The array of param objects (v-model)
 * @emits update:modelValue - When params change
 * @emits focus - When an input is focused
 * @emits blur - When an input is blurred
 *
 * Features:
 * - Card-based layout, accessible, keyboard navigation
 * - Optional slot for description
 */
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    }
});
const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

function addParam() {
    const newParams = [...props.modelValue, { key: '', value: '' }];
    emit('update:modelValue', newParams);
}

function removeParam(idx) {
    const newParams = props.modelValue.slice();
    newParams.splice(idx, 1);
    emit('update:modelValue', newParams);
}
</script>
