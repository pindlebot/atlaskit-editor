import {
  MediaMock,
  generateFilesFromTestData,
} from '@atlaskit/media-test-helpers'
import { fakeImage } from '@atlaskit/media-test-helpers/mocks/database/mockData'

export default new MediaMock({
  recents: generateFilesFromTestData([
    {
      name: 'one.svg',
      dataUri: fakeImage,
    },
    {
      name: 'two.svg',
      dataUri: fakeImage,
    },
    {
      name: 'three.svg',
      dataUri: fakeImage,
    },
    {
      name: 'four.svg',
      dataUri: fakeImage,
    },
    {
      name: 'five.svg',
      dataUri: fakeImage,
    },
  ]),
});
