import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { useEffect, useState } from 'react';
import { fetchCountries } from '../features/slices/countriesSlice';
import { fetchSubforums } from '../features/slices/subforumsSlice';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { PostForm } from '../components/forms/PostForm';
import 'flag-icons/css/flag-icons.min.css';
import { createPostService } from '../services/createPostService';
import { Layout } from '../components/layout/Layout';

export default function NewPostPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [subforumSelected, setSubforumSelected] = useState('');
  const [countriesSelected, setCountriesSelected] = useState<string[]>([]);

  useEffect(() => {
    if (subforumsStatus === 'idle') {
      dispatch(fetchSubforums());
    }
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, subforumsStatus, countriesStatus]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPost = await createPostService(
        { title, content, countries: countriesSelected },
        subforumSelected
      );
      navigate(`/posts/${newPost.id}`);
    } catch (error) {
      console.error('Post creation failed: ', error);
      navigate('/');
    }
  };
  const handleSubforumChange = (event: SelectChangeEvent) => {
    setSubforumSelected(event.target.value as string);
  };
  const handleCountriesChange = (
    event: SelectChangeEvent<typeof countriesSelected>
  ) => {
    const {
      target: { value },
    } = event;
    setCountriesSelected(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Layout>
      <PostForm category='Post' handleSubmit={handleSubmit}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='title'
          name='title'
          label='Title'
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormControl fullWidth margin='normal' required>
          <InputLabel id='subforum-select-label'>Subforum</InputLabel>
          <Select
            labelId='subforum-select-label'
            id='subforum-select'
            value={subforumSelected}
            label='Subforum'
            onChange={handleSubforumChange}
          >
            {subforums
              .filter((subforum) => subforum.category === 'Generic')
              .map((subforum) => (
                <MenuItem key={subforum.id} value={subforum.id}>
                  {subforum.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel id='countries-multiple-chip-label'>Countries</InputLabel>
          <Select
            labelId='countries-multiple-chip-label'
            id='countries-multiple-chip'
            label='Countries'
            multiple
            value={countriesSelected}
            onChange={handleCountriesChange}
            input={<OutlinedInput id='countries' label='Countries' />}
            renderValue={(selectedCountry) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedCountry.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.name}>
                <span
                  className={`fi fi-${country.code.toLowerCase()}`}
                  style={{ marginRight: 7 }}
                />
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin='normal'
          required
          fullWidth
          id='content'
          name='content'
          label='Content'
          multiline
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </PostForm>
    </Layout>
  );
}
