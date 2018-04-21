import { request } from './misc';
import { SERVER_ADDRESS } from '../constants/index';

export default function getSysLoad() {
  return request(`${SERVER_ADDRESS}/api/load`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
