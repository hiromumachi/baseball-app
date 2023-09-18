<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>
        MLB試合予想アプリ
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <TenserFlow/>
  

    </v-main>
  </v-app>
</template>

<script>

import TenserFlow from './components/TenserFlow.vue';
export default {
  name: 'App',

  components: {
    TenserFlow,
  },

  data: () => ({
    //
  }),
}
</script>
