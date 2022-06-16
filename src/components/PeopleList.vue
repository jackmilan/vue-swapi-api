<template>
  <q-table
    title="People"
    :rows="people"
    :columns="columns"
    row-key="name"
    :filter="filter"
    :filter-method="filterData"
    no-data-label="I didn't find anything for you"
    no-results-label="The filter didn't uncover any results"
    :loading="isLoading"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="height" :props="props">
          {{ props.row.height }}
        </q-td>
        <q-td key="mass" :props="props">
          {{ props.row.mass }}
        </q-td>
        <q-td key="created" :props="props">
          {{ formatDate(props.row.created) }}
        </q-td>
        <q-td key="edited" :props="props">
          {{ formatDate(props.row.edited) }}
        </q-td>
        <q-td key="homeworld" :props="props">
          <template v-if="getPlanetName(props.row.homeworld)">
            <q-btn
              outline
              size="sm"
              color="black"
              :label="getPlanetName(props.row.homeworld)"
              @click="selectedPlanet = getPlanet(props.row.homeworld)"
            />
          </template>
          <template v-else-if="isLoading">
            <q-spinner-tail color="primary" size="2em" />
          </template>
          <template v-else> unknown </template>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>

  <planet-info-dialog
    :modelValue="!!selectedPlanet"
    :planet="selectedPlanet"
    @close="selectedPlanet = undefined"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import SwapiService, { IPeople, IPlanet } from "@/services/SwapiService";
import PlanetInfoDialog from "./PlanetInfoDialog.vue";

export default defineComponent({
  components: { PlanetInfoDialog },
  name: "PeopleList",
  data: () => ({
    isLoading: true as boolean,
    columns: [] as any[],
    people: [] as IPeople[],
    planets: [] as IPlanet[],
    filter: "" as string,
    selectedPlanet: undefined as IPlanet | undefined,
  }),
  created() {
    this.initData();

    this.columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        sortable: true,
        field: "name",
      },
      {
        name: "height",
        required: true,
        label: "Height",
        sortable: true,
        field: (row: IPeople) => +row.height,
      },
      {
        name: "mass",
        required: true,
        label: "Mass",
        sortable: true,
        field: (row: IPeople) => +row.mass,
      },
      {
        name: "created",
        required: true,
        label: "Created",
        sortable: true,
        field: "created",
      },
      {
        name: "edited",
        required: true,
        label: "Edited",
        sortable: true,
        field: "edited",
      },
      {
        name: "homeworld",
        required: true,
        label: "Planet name",
        sortable: true,
        field: (row: IPeople) => this.getPlanetName(row.homeworld),
      },
    ];
  },
  methods: {
    async initData(): Promise<void> {
      try {
        await Promise.all([this.getAllPeople(), this.getAllPlanets()]);
      } catch (error) {
        throw new Error("Error while api loading - " + JSON.stringify(error));
      } finally {
        this.isLoading = false;
      }
    },

    async getAllPeople(page: number = 1): Promise<void> {
      try {
        const peopleApiData = await SwapiService.getPeople(page);

        this.people = [...this.people, ...peopleApiData.data.results];

        // FIRST METHOD to fetch other people,
        // recursive function (in sequence)
        // if (peopleApiData.data.next) {
        //   await this.getAllPeople(++page);
        // }

        // SECOND METHOD to fetch other people, parallel promises,
        // it's faster, but it's make a rule for response result size to be 10
        // and i'm not sure that swapi api will not change it

        const count = Math.ceil(peopleApiData.data.count / 10) - 1;

        const requests = Array(count)
          .fill(0)
          .map((_, index) => {
            const page = index + 2;
            return SwapiService.getPeople(page);
          });

        const results = await Promise.all(requests);

        results.forEach((row) => {
          this.people = [...this.people, ...row.data.results];
        });
      } catch (error) {
        throw new Error(
          "Error while fetching people - " + JSON.stringify(error)
        );
      }
    },

    async getAllPlanets(page: number = 1): Promise<void> {
      try {
        const planetsApiData = await SwapiService.getPlanets(page);

        this.planets = [...this.planets, ...planetsApiData.data.results];

        // FIRST METHOD to fetch other people,
        // recursive function (in sequence)
        // if (planetsApiData.data.next) {
        //   await this.getAllPlanets(++page);
        // }

        // SECOND METHOD to fetch other people, parallel promises,
        // it's faster, but it's make a rule for response result size to be 10
        // and i'm not sure that swapi api will not change it

        const count = Math.ceil(planetsApiData.data.count / 10) - 1;

        const requests = Array(count)
          .fill(0)
          .map((_, index) => {
            const page = index + 2;
            return SwapiService.getPlanets(page);
          });

        const results = await Promise.all(requests);

        results.forEach((row) => {
          this.planets = [...this.planets, ...row.data.results];
        });
      } catch (error) {
        throw new Error("Error while fetching planets");
      }
    },

    getPlanetId(homeworldUrl: string): number | null {
      const planetId = /\d+/g.exec(homeworldUrl);

      if (!planetId) {
        return null;
      }

      return +planetId;
    },

    getPlanetName(homeworldUrl: string): string {
      const planet = this.getPlanet(homeworldUrl);

      if (!planet || planet.name === 'unknown') {
        return "";
      }

      return planet.name;
    },

    getPlanet(homeworldUrl: string): IPlanet | undefined {
      return this.planets.find(
        (row) => this.getPlanetId(row.url) === this.getPlanetId(homeworldUrl)
      );
    },

    filterData(): IPeople[] {
      if (this.filter) {
        // filter only by name
        return this.people.filter((row) =>
          row.name.toLowerCase().includes(this.filter.toLowerCase())
        );
      } else {
        return this.people;
      }
    },

    formatDate(date: string = ""): string {
      if (!date) {
        return "";
      }

      return moment(date).format("L");
    },
  },
});
</script>