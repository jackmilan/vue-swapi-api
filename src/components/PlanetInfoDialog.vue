<template>
  <q-dialog ref="dialogRef" v-model="model" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <template v-if="planet">
        <q-card-section>
          <div class="text-h6">Planet info</div>
        </q-card-section>

        <q-card-section>
          <q-item-label>Name:</q-item-label>
          <q-item-label caption class="text-capitalize">{{
            planet.name
          }}</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item-label>Diameter:</q-item-label>
          <q-item-label caption class="text-capitalize">{{
            planet.diameter
          }}</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item-label>Climate:</q-item-label>
          <q-item-label caption class="text-capitalize">{{
            planet.climate
          }}</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item-label>Population:</q-item-label>
          <q-item-label caption class="text-capitalize">{{
            planet.population
          }}</q-item-label>
        </q-card-section>
      </template>

      <q-card-actions align="right">
        <q-btn color="primary" label="Close" @click="onCloseClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { IPlanet } from "@/services/SwapiService";
import { useDialogPluginComponent } from "quasar";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "PlanetInfoDialog",
  props: {
    modelValue: { type: Boolean, required: true },
    planet: { type: Object as () => IPlanet | undefined, required: true },
  },
  setup(props, { emit }) {
    const { dialogRef, onDialogHide, onDialogCancel } =
      useDialogPluginComponent();

    const model = computed({
      get() {
        return props.modelValue;
      },
      set(newValue) {
        emit("close", newValue);
      },
    });

    return {
      model,
      dialogRef,
      onDialogHide,
      onCloseClick: onDialogCancel,
    };
  },
});
</script>

<style lang="sass" scoped>
.text-capitalize
    text-transform: capitalize
</style>