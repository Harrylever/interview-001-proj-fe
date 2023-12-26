/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
// Import {type IMainOption} from '../../types';

const BASE_URL = import.meta.env.VITE_APP_MODE === 'test'
  ? 'http://localhost:3000/api/v1'
  : 'https://interview-001-project-be.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 6000000,
});

export async function getAllOptions() {
  const fetch = await axiosInstance.get('/options/getmultiple');
  return fetch.data;
}

export async function gettSingleOption(optionId: string) {
  const fetch = await axiosInstance.get(`/options/getsingle/${optionId}`);
  return fetch.data;
}

export async function postNewRecord({
  name,
  sectors,
  currentRecordId,
}: {
  name: string;
  sectors: { value: string }[];
  currentRecordId: string;
}) {
  const fetch = await axiosInstance.post('/record/create', {
    name,
    sectors,
    currentRecordId,
  });
  return fetch.data;
}

export async function getCurrentRecord({ recordId }: { recordId: string }) {
  const fetch = await axiosInstance.get(`/record/getrecord/${recordId}`);
  return fetch.data;
}
