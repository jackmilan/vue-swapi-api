<template>
  <table class="table">
    <thead>
      <tr>
        <template v-for="(head, key) in heads" :key="key">
          <th class="text-capitilize" v-text="head" />
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-if="people.length">
        <template v-for="(row, key) in people" :key="key">
          <tr>
            <td></td>
          </tr>
        </template>
      </template>
      <template v-else>
        <tr :aria-colspan="heads.length">
          No items ...
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PeopleList",
  data: () => ({
    heads: ["name", "height", "mass", "created", "edited", "planet name"],
    people: [],
  }),
});
</script>

<style lang="sass" scoped>
.text-capitilize
    text-transform: capitalize

table
    width: 100%
    max-width: 100%
    margin-bottom: 1rem
    background-color: transparent
    text-align: center

thead
    display: table-header-group
    vertical-align: middle
    border-color: inherit

.table thead th
    vertical-align: bottom
    border-bottom: 2px solid #dee2e6

.table td, .table th
    padding: 0.75rem
    vertical-align: top
    border-top: 1px solid #dee2e6
</style>