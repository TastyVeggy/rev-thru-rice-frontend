import { Subforum } from './../../interfaces/subforum';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from '../../config';

interface SubforumsState {
  items: Subforum[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SubforumsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchSubforums = createAsyncThunk(
  'topics/fetchSubforums',
  async () => {
    const url = `${config.apiUrl}/subforums`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch subforums');
    }
    return (await response.json()) as Subforum[];
  }
);

const subforumsSlice = createSlice({
  name: 'subforums',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubforums.pending, (state: SubforumsState) => {
        state.status = 'loading';
      })
      .addCase(
        fetchSubforums.fulfilled,
        (state: SubforumsState, action: PayloadAction<Subforum[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchSubforums.rejected, (state: SubforumsState, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default subforumsSlice.reducer;
