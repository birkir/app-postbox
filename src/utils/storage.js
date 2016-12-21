import { AsyncStorage } from 'react-native';
import { toJS } from 'mobx';
import { DEBUG } from './env';

const STORAGE_KEY = '@PBClient:store';

export async function write(store) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toJS(store)));
  } catch (error) {
    DEBUG && console.warn('Could not write data to storage: %o', error); // eslint-disable-line
  }
}

export async function read() {
  try {
    const storage = await AsyncStorage.getItem(STORAGE_KEY);
    if (storage !== null) {
      return JSON.parse(storage);
    }
  } catch (error) {
    DEBUG && console.warn('Could not read data from storage: %o', error); // eslint-disable-line
    return {};
  }
}

export async function reset() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, '{}');
  } catch (error) {
    DEBUG && console.warn('Could not reset storage: %o', error); // eslint-disable-line
  }
}
