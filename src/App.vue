<script setup>
import { useMainStore } from './store';
import { computed, ref } from 'vue';
import MainView from './views/MainView.vue';
import PluginManager from './components/PluginManager.vue';
import EnvironmentManager from './components/EnvironmentManager.vue';
import { HomeIcon, FolderIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import ResponseViewer from './components/ResponseViewer.vue';
import MyCollectionsManager from './components/MyCollectionsManager.vue';

const store = useMainStore();
const historyItems = computed(() => store.history);

const sidebarOpen = ref(true);
const sidebarWidth = ref(224); // Default width in px (14rem)
const minSidebarWidth = 120;
const maxSidebarWidth = 320;
let isResizing = false;

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function startResize(e) {
  // Only start resizing if left mouse button
  if (e.button === 0) {
    isResizing = true;
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

// Tabs for response details
const responseTabs = ['Body', 'Headers', 'Raw'];
const activeResponseTab = ref('Body');
</script>

<template>
  <!-- Main Layout: Full viewport usage -->
  <div class="fixed inset-0 flex flex-row min-h-screen min-w-full max-h-screen max-w-full overflow-hidden">
    <!-- Collapsible/Resizable Sidebar -->
    <aside v-if="sidebarOpen"
      class="bg-[#1e1f1c]/80 backdrop-blur-xl border-r-8 border-[#fd971f] min-h-full flex flex-col gap-6 items-start shadow-2xl transition-all duration-300 ease-in-out"
      :style="`width: ${sidebarWidth}px; min-width: ${minSidebarWidth}px; max-width: ${maxSidebarWidth}px; overflow: auto;`">
      <MyCollectionsManager />
      <EnvironmentManager />
      <PluginManager />
      <!-- Sidebar resize/toggle bar -->
      <div v-if="sidebarOpen"
        class="absolute top-0 right-0 h-full w-6 flex items-center justify-center cursor-col-resize z-50 bg-[#fd971f]/10 hover:bg-[#fd971f]/30 transition-colors duration-200"
        @mousedown="startResize">
        <span
          class="text-[#fd971f] text-lg font-bold opacity-70 hover:opacity-100 transition-opacity duration-200 select-none">⏴</span>
      </div>
    </aside>
    <!-- Always-visible sidebar toggle when collapsed -->
    <div v-if="!sidebarOpen"
      class="fixed top-0 left-0 h-full w-6 flex items-center justify-center cursor-pointer z-50 bg-[#fd971f]/10 hover:bg-[#fd971f]/30 transition-colors duration-200"
      @click="toggleSidebar">
      <span
        class="text-[#fd971f] text-lg font-bold opacity-70 hover:opacity-100 transition-opacity duration-200 select-none">⏵</span>
    </div>

    <!-- Main Content: Split Pane Layout -->
    <main
      class="flex-1 flex flex-col bg-gradient-to-br from-[#23241f] via-[#1a1a19] to-[#23272A] min-h-0 overflow-hidden p-0 border-l border-[#75715e] shadow-inner h-full w-full">
      <div class="flex flex-col min-h-0 gap-4 h-full w-full" style="height: 100%;">
        <div
          class="flex-1 flex flex-col justify-stretch border-b border-[#75715e] pb-4 bg-[#282a36] rounded-xl shadow-md"
          style="height: 50%; min-height: 0;">
          <!-- RequestComposer goes here -->
          <MainView class="flex-1 h-full w-full" />
        </div>
        <!-- Tabs for ResponseViewer -->
        <div
          class="flex flex-row items-center gap-2 pt-2 pb-1 border-b border-[#75715e] bg-[#23241f] rounded-t-xl shadow-sm">
          <button v-for="tab in responseTabs" :key="tab" @click="activeResponseTab = tab"
            :class="['px-6 py-2 rounded-t-xl font-semibold focus:outline-none transition-colors duration-150 border-b-2',
              activeResponseTab === tab ? 'bg-[#fd971f] text-[#23241f] border-[#fd971f] shadow' : 'bg-[#282a36] text-[#f8f8f2] border-transparent hover:bg-[#49483e]/60 hover:text-[#fd971f]']"
            :aria-selected="activeResponseTab === tab" :tabindex="activeResponseTab === tab ? 0 : -1">
            {{ tab }}
          </button>
        </div>
        <div class="flex-1 flex flex-col justify-stretch pt-4 bg-[#282a36] rounded-b-xl shadow-inner"
          style="height: 50%; min-height: 0;">
          <!-- ResponseViewer: show tab content -->
          <ResponseViewer :activeTab="activeResponseTab" class="flex-1 h-full w-full" />
        </div>
      </div>
      <!-- PluginManager stays at the bottom -->
      <div class="mt-6">
        <PluginManager />
      </div>
    </main>
  </div>
</template>
