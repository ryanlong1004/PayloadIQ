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
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>


<template>
  <div class="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-inter flex flex-col">
    <!-- Header -->
    <header
      class="w-full h-14 bg-[#23233B]/80 backdrop-blur-xl flex items-center justify-between px-6 shadow-md border-b border-[#23233B]">
      <div class="flex items-center gap-3">
        <img src="/src/assets/payload_iq_mascot.png" alt="PayloadIQ Mascot"
          style="height: 4.5rem; width: 4.5rem; object-fit: contain;" />
        <span class="text-white text-xl font-semibold tracking-wide">PayloadIQ</span>
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
        class="bg-gray-800/70 backdrop-blur-xl border-r border-cyan-400 min-h-full flex flex-col gap-6 items-start shadow-2xl transition-all duration-200"
        style="width: 14rem; min-width: 120px; max-width: 220px; overflow: auto;">
        <nav class="w-full flex-1">
          <ul class="space-y-3 mt-6">
            <li
              class="flex items-center gap-3 text-[#E0E0E0] hover:text-cyan-400 transition-all duration-200 ease-in-out cursor-pointer text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-800/60 hover:scale-110 drop-shadow-[0_0_8px_cyan] border-l-4 border-transparent hover:border-cyan-400">
              <HomeIcon class="h-5 w-5" /> <span>Requests</span>
            </li>
            <li
              class="flex items-center gap-3 text-[#E0E0E0] hover:text-purple-400 transition-all duration-200 ease-in-out cursor-pointer text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-800/60 hover:scale-110 drop-shadow-[0_0_8px_purple] border-l-4 border-transparent hover:border-purple-400">
              <FolderIcon class="h-5 w-5" /> <span>Collections</span>
            </li>
            <li
              class="flex items-center gap-3 text-[#E0E0E0] hover:text-green-400 transition-all duration-200 ease-in-out cursor-pointer text-base font-semibold py-2 px-3 rounded-lg hover:bg-gray-800/60 hover:scale-110 drop-shadow-[0_0_8px_lime] border-l-4 border-transparent hover:border-green-400">
              <Cog6ToothIcon class="h-5 w-5" /> <span>Environments</span>
            </li>
          </ul>
        </nav>
        <div class="w-full">
          <span class="text-xs text-cyan-400 font-bold uppercase tracking-wide pl-2 mb-2 block">History</span>
          <ul class="space-y-2 px-2 pb-2">
            <li v-for="item in historyItems" :key="item.id"
              class="flex items-center gap-2 bg-gray-800/70 hover:bg-gray-800/90 rounded-lg px-3 py-2 transition-all duration-200 ease-in-out cursor-pointer shadow-sm border-l-4 border-transparent hover:border-cyan-400">
              <span class="text-xs font-bold px-2 py-1 rounded bg-[#18181B] text-cyan-400">{{ item.method }}</span>
              <span class="text-gray-200 truncate flex-1">{{ item.endpoint }}</span>
              <span class="text-cyan-300 text-xs">{{ item.time }}</span>
            </li>
          </ul>
        </div>
      </aside>
      <button @click="toggleSidebar"
        class="absolute left-2 top-16 z-10 bg-[#23233B] text-[#00FFD0] rounded-full p-2 shadow hover:bg-[#2A2A3B] transition-all duration-200">
        <span v-if="sidebarOpen">⏴</span>
        <span v-else>⏵</span>
      </button>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col bg-[#1E1E2F] min-h-0 overflow-hidden pb-8 md:pb-12 pr-4 md:pr-8 pl-4 md:pl-8">
        <MainView />
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
