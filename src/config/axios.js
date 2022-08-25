import axios from 'axios';

axios.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? 'http://10.0.0.10:3000/' : 'https://gt.jedlik.eu:3000/';
