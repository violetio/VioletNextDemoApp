import { ICountry } from '@violet/violet-js/interfaces/Country.interface';
import axios from 'axios';
import useSWR from 'swr';

/**
 * Custom hook to retrieve supported countries data using SWR library
 */
const useSupportedCountries = () => {
  const { data } = useSWR<ICountry[]>(
    '/api/billing/supported_countries',
    async (url) => (await axios.get(url)).data,
    {
      revalidateOnFocus: false,
    }
  );

  // Sort data
  if (data) {
    data.sort(function (a, b) {
      if (a.countryName < b.countryName) return -1;
      if (a.countryName > b.countryName) return 1;
      return 0;
    });
    return data;
  }
  return [];
};

export default useSupportedCountries;
