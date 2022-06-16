import http from '@/http-common';

export interface ISwapiApiPeople {
  data: {
    count: number;
    next: string;
    previous: string;
    results: IPeople[];
  };
}

export interface IPeople {
  name: string;
  height: string;
  mass: string;
  created: string;
  edited: string;
  homeworld: string;
}

export interface ISwapiApiPlanet {
  data: {
    count: number;
    next: string;
    previous: string;
    results: IPlanet[];
  };
}

export interface IPlanet {
  name: string;
  diameter: string;
  climate: string;
  population: string;
  url: string
}

class SwapiService {
  getPeople(page: number): Promise<ISwapiApiPeople> {
    return http.get(`people?page=${page}`);
  }

  getPlanets(page: number): Promise<ISwapiApiPlanet> {
    return http.get(`planets?page=${page}`);
  }
}

export default new SwapiService();
