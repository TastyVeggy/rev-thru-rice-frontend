import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from '../../config';

export interface Country {
  id: number;
  name: string;
  description: string;
  code: string;
}

interface CountryRes {
  id: number;
  name: string;
  description: string;
}

interface CountriesState {
  items: Country[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CountriesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async () => {
    const countryRes = await fetch(`${config.apiUrl}/countries`);
    if (!countryRes.ok) {
      throw new Error('Failed to fetch country data');
    }

    const countries: CountryRes[] = await countryRes.json();

    const countryCodeMappingRes = await fetch(config.countryCodesJsonPath);
    if (!countryCodeMappingRes.ok) {
      throw new Error('Failed to fetch country code mapping');
    }
    const countryCodeMapping = await countryCodeMappingRes.json();

    return countries.map((country: CountryRes) => ({
      ...country,
      code: countryCodeMapping[country.name] || '',
    }));
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state: CountriesState) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCountries.fulfilled,
        (state: CountriesState, action: PayloadAction<Country[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchCountries.rejected, (state: CountriesState, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default countriesSlice.reducer;
