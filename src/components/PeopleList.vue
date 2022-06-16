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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import SwapiService, { IPeople, IPlanet } from "@/services/SwapiService";

export default defineComponent({
  name: "PeopleList",
  data: () => ({
    isLoading: true as boolean,
    columns: [] as any[],
    people: [] as IPeople[],
    planets: [] as IPlanet[],
    filter: "" as string,
  }),
  created() {
    this.initData();

    this.columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        sortable: true,
        field: (row: IPeople) => row.name,
      },
      {
        name: "height",
        required: true,
        label: "Height",
        sortable: true,
        field: (row: IPeople) => row.height,
      },
      {
        name: "mass",
        required: true,
        label: "Mass",
        sortable: true,
        field: (row: IPeople) => row.mass,
      },
      {
        name: "created",
        required: true,
        label: "Created",
        sortable: true,
        field: (row: IPeople) => moment(row.created).format("L"),
      },
      {
        name: "edited",
        required: true,
        label: "Edited",
        sortable: true,
        field: (row: IPeople) => moment(row.edited).format("L"),
      },
      {
        name: "planetName",
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

    getPlanetName(homeworldUrl: string): string | null {
      const planet = this.planets.find(
        (row) => this.getPlanetId(row.url) === this.getPlanetId(homeworldUrl)
      );

      if (!planet) {
        return null;
      }

      return planet.name;
    },

    filterData() {
      if (this.filter) {
        // filter only by name
        return this.people.filter((row) =>
          row.name.toLowerCase().includes(this.filter.toLowerCase())
        );
      } else {
        return this.people;
      }
    },
  },
});
</script>