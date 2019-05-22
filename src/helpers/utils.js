import {
  JSONTransformer
} from '@atlaskit/editor-json-transformer'

const transformer = new JSONTransformer()

export function toJSON (node) {
  return transformer.encode(node)
}
