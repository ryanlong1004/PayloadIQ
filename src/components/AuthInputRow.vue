<template>
    <div class="flex items-center gap-2">
        <input :value="value" @input="$emit('input', $event)" :placeholder="placeholder"
            class="flex-1 rounded-lg bg-[#23272e] border border-[rgba(102,217,239,0.4)] text-[#66d9ef] px-3 py-2 text-xs font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-[#66d9ef] focus:border-[#66d9ef] transition-all duration-150"
            aria-label="Authorization input" autocomplete="off" />
        <button v-if="value" @click="$emit('copy')" type="button"
            class="px-2 py-1 rounded border border-[#66d9ef] text-[#66d9ef] bg-[#23272e] hover:bg-[#66d9ef] hover:text-[#23272e] focus:bg-[#66d9ef] focus:text-[#23272e] text-xs font-mono transition-colors duration-150"
            aria-label="Copy authorization header" title="Copy to clipboard">
            <svg class="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 16h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm0 0v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2" />
            </svg>
            Copy
        </button>
    </div>
</template>

<script setup>
defineProps({
    value: String,
    placeholder: String
});
</script>
