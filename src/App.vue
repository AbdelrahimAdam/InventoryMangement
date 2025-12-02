<template>
  <div id="app" dir="rtl" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  setup() {
    const store = useStore();

    onMounted(async () => {
      await store.dispatch('initializeAuth');
      await store.dispatch('loadWarehouses');
    });

    return {};
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

* {
  font-family: 'Tajawal', Arial, sans-serif;
}

.rtl {
  direction: rtl;
  text-align: right;
}

/* Custom scrollbar for RTL */
.rtl::-webkit-scrollbar {
  width: 8px;
}

.rtl::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.rtl::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.rtl::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>