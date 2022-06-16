<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="main">
        <h1 class="page-title">Vue Swapi App</h1>

        <people-list />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import PeopleList from "@/components/PeopleList.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { PeopleList },
  name: "HomePage",
});
</script>

<style lang="sass" scoped>
.main
  padding: 0 3rem

h1
  margin-bottom: 0.5rem
  font-family: inherit
  font-weight: 500
  line-height: 1.2
  color: inherit

.page-title
  margin-bottom: 2rem
</style>