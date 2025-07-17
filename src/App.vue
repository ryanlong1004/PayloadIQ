<script setup>
import { useMainStore } from './store';
import { computed } from 'vue';
const store = useMainStore();
const historyItems = computed(() => store.history);

function addTestHistory() {
  const now = new Date();
  store.history.push({
    id: Date.now(),
    method: 'GET',
    endpoint: `/api/test/${Math.floor(Math.random() * 100)}`,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
}
import MainView from './views/MainView.vue';
import { HomeIcon, FolderIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

const sidebarOpen = ref(true);
const sidebarWidth = ref(224); // Default width in px (14rem)
const minSidebarWidth = 120;
const maxSidebarWidth = 320;
let isResizing = false;
let resizeHandleClicked = false;

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function startResize(e) {
  // Only start resizing if left mouse button and not a quick click
  if (e.button === 0) {
    isResizing = true;
    resizeHandleClicked = false;
    document.body.style.cursor = 'col-resize';
  }
}

function handleResizeHandleClick(e) {
  // If not resizing, treat as toggle
  if (!isResizing) {
    toggleSidebar();
  }
}

function onResize(e) {
  if (!isResizing) return;
  const newWidth = e.clientX - document.querySelector('aside').getBoundingClientRect().left;
  sidebarWidth.value = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, newWidth));
}

function stopResize() {
  isResizing = false;
  document.body.style.cursor = '';
}

window.addEventListener('mousemove', onResize);
window.addEventListener('mouseup', stopResize);
</script>


<template>
  <div class="min-h-screen w-screen bg-[#272822] font-inter flex flex-col">
    <!-- Header -->
    <header
      class="w-full h-20 bg-[#2d2e2a] flex items-center justify-between px-8 shadow-lg border-t-4 border-b-4 border-[#fd971f] py-4 md:py-6 mt-0 mb-0 z-20 relative"
      style="box-shadow: 0 4px 18px 0 #1e1f1c80;">
      <div class="flex items-center gap-4">
        <img src="/src/assets/payload_iq_mascot.png" alt="PayloadIQ Mascot"
          style="height: 5.2rem; width: 5.2rem; object-fit: contain; filter: drop-shadow(0 0 12px #fd971f) brightness(1.15);" />
        <span class="text-white text-2xl font-extrabold tracking-wide select-none">
          Payload<span class="text-[#fd971f]">IQ</span>
        </span>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-gray-300 hover:text-white transition-colors rounded-lg p-2 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button class="text-gray-300 hover:text-white transition-colors rounded-lg p-2 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex flex-1 min-h-0">
      <!-- Collapsible/Resizable Sidebar -->
      <aside v-if="sidebarOpen"
        class="bg-[#1e1f1c]/80 backdrop-blur-xl border-r-8 border-[#fd971f] min-h-full flex flex-col gap-6 items-start shadow-2xl transition-all duration-300 ease-in-out"
        :style="`width: ${sidebarWidth}px; min-width: ${minSidebarWidth}px; max-width: ${maxSidebarWidth}px; overflow: auto;`">
        <nav class="w-full flex-1">
          <ul class="space-y-3 mt-6">
            <li
              class="flex items-center gap-3 text-[#f8f8f2] hover:text-[#a6e22e] transition-colors duration-150 cursor-pointer text-base font-semibold py-2 px-3 rounded-lg hover:bg-[#49483e]/60 border-l-4 border-transparent hover:border-[#a6e22e]">
              <HomeIcon class="h-5 w-5" /> <span class="!shadow-none !text-shadow-none">Requests</span>
            </li>
            <li
              class="flex items-center gap-3 text-[#f8f8f2] hover:text-[#fd971f] transition-colors duration-150 cursor-pointer text-base font-semibold py-2 px-3 rounded-lg hover:bg-[#49483e]/60 border-l-4 border-transparent hover:border-[#fd971f]">
              <FolderIcon class="h-5 w-5" /> <span>Collections</span>
            </li>
            <li
              class="flex items-center gap-3 text-[#f8f8f2] hover:text-[#66d9ef] transition-colors duration-150 cursor-pointer text-base font-semibold py-2 px-3 rounded-lg hover:bg-[#49483e]/60 border-l-4 border-transparent hover:border-[#66d9ef]">
              <Cog6ToothIcon class="h-5 w-5" /> <span>Environments</span>
            </li>
          </ul>
        </nav>
        <div class="w-full">
          <span class="text-xs text-[#a6e22e] font-bold uppercase tracking-wide pl-2 mb-2 block">History</span>
          <ul class="space-y-2 px-2 pb-2">
            <li v-for="item in historyItems" :key="item.id"
              class="flex items-center gap-2 bg-[#49483e]/70 hover:bg-[#49483e]/90 rounded-lg px-3 py-2 transition-colors duration-150 cursor-pointer border-l-4 border-transparent hover:border-[#a6e22e]">
              <span class="text-xs font-bold px-2 py-1 rounded bg-[#272822] text-[#a6e22e]">{{ item.method }}</span>
              <span class="text-[#f8f8f2] truncate flex-1">{{ item.endpoint }}</span>
              <span class="text-[#fd971f] text-xs">{{ item.time }}</span>
            </li>
          </ul>
        </div>
        <!-- Sidebar resize handle and collapse button -->
        <div class="absolute top-0 right-0 h-full w-8 flex items-center justify-end z-40">
          <div class="h-full w-4 cursor-col-resize bg-transparent hover:bg-[#fd971f]/30 transition-colors duration-200"
            @mousedown="startResize"></div>
          <div
            class="h-full w-4 flex items-center justify-center cursor-pointer bg-[#fd971f]/10 hover:bg-[#fd971f]/30 transition-colors duration-200"
            @click="toggleSidebar">
            <span
              class="text-[#fd971f] text-lg font-bold opacity-70 hover:opacity-100 transition-opacity duration-200 select-none">⏴</span>
          </div>
        </div>
      </aside>
      <!-- Always-visible clickable sidebar border for toggle -->
      <div v-if="!sidebarOpen"
        class="fixed top-0 left-0 h-full w-8 pr-2 flex items-center justify-center cursor-pointer z-50 bg-[#fd971f]/10 hover:bg-[#fd971f]/30 transition-colors duration-200"
        @click="toggleSidebar">
        <span
          class="text-[#fd971f] text-lg font-bold opacity-70 hover:opacity-100 transition-opacity duration-200 select-none">⏵</span>
      </div>

      <!-- Main Content -->
      <main
        class="flex-1 flex flex-col bg-[#1a1a19] min-h-0 overflow-hidden pb-8 md:pb-12 pr-4 md:pr-8 pl-4 md:pl-8 border-l border-[#75715e] shadow-inner">
        <!-- Add a wrapper for MainView to increase contrast and add depth -->
        <div class="rounded-xl bg-[#23241f] border border-[#f8f8f2] p-2 md:p-4 transition-colors duration-200">
          <MainView />
        </div>
        <div class="w-full h-8 md:h-12"></div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.7s ease;
}

@keyframes slide-in-left {
  from {
    transform: translateX(-40px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-left {
  animation: slide-in-left 0.7s cubic-bezier(.4, 0, .2, 1);
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
