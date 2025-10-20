declare module "world-countries" {
  interface OfficialAndCommon {
    official: string;
    common: string;
  }

  interface Demonyms {
    f: string;
    m: string;
  }

  interface Country {
    name: OfficialAndCommon;
    tld: string[];
    cca2: string;
    ccn3: string;
    cca3: string;
    cioc: string;
    independent: boolean;
    status: string;
    unMember: boolean;
    currencies: { [currencyCode: string]: { name: string; symbol: string } };
    idd: { root: string; suffixes: string[] };
    capital: string[];
    altSpellings: string[];
    region: string;
    subregion: string;
    languages: { [languageCode: string]: string };
    translations: { [languageCode: string]: OfficialAndCommon };
    latlng: [number, number];
    demonyms?: { [languageCode: string]: Demonyms };
    landlocked: boolean;
    borders: string[];
    area: number;
    flag: string;
    maps: { googleMaps: string; openStreetMaps: string };
    population: number;
    fifa: string;
    car: { signs: string[]; side: string };
    timezones: string[];
    continents: string[];
    flags: { png: string; svg: string };
    coatOfArms: { png: string; svg: string };
    startOfWeek: string;
    capitalInfo: { latlng: [number, number] };
    postalCode?: { format: string; regex: string };
  }

  const countries: Country[];
  export default countries;
}
