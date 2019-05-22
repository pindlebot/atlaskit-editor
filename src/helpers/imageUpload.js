import {
  Converter,
  dropHandler,
  pasteHandler
} from '@atlaskit/editor-test-helpers';

const converter = new Converter(['jpg', 'jpeg', 'png', 'gif', 'svg'], 10000000);

const imageUploadHandler = (e, fn) => {
  // ED-3294: we cannot insert base64 images so we just simulate inserting an image
  const uploadDefaultImage = () =>
    fn({ src: 'https://design.atlassian.com/images/brand/logo-21.png' });

  if (e && e.type === 'paste') {
    pasteHandler(converter, e, uploadDefaultImage);
  } else if (e && e.type === 'drop') {
    dropHandler(converter, e, uploadDefaultImage);
  } else {
    const imageUrl = prompt('Enter the image URL to insert:');
    if (imageUrl) {
      fn({
        src: imageUrl,
      });
    }
  }
};

export default imageUploadHandler

