// import { emoji } from '@atlaskit/util-data-test'

// const emojiTestData = emoji.testData;

// const toEmojiAttrs = (emoji) => {
//   const { shortName, id, fallback } = emoji;
//   return {
//     shortName,
//     id,
//     text: fallback || shortName,
//   };
// };

// const grinEmojiAttrs = toEmojiAttrs(emojiTestData.grinEmoji);
// const evilburnsEmojiAttrs = toEmojiAttrs(emojiTestData.evilburnsEmoji);

export const exampleDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
      ]
    }
  ]     
};
