import { ListView } from 'react-native';

export default new ListView.DataSource({ rowHasChanged: (a, b) => (a !== b) });
