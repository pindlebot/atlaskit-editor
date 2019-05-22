import * as React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import Button, { ButtonGroup } from '@atlaskit/button'

import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core'
import { exampleDocument } from './helpers/example-document'
import { DevTools } from './helpers/DevTools'
// import '@atlaskit/css-reset'
import './styles/main.scss'
import ToolsDrawer from './helpers/ToolsDrawer';

export const Wrapper = styled.div`
  box-sizing: border-box
  height: calc(100vh - 32px)
`

export const Content = styled.div`
  padding: 0
  height: 100%
  box-sizing: border-box
`

const SAVE_ACTION = () => console.log('Save')

const SaveAndCancelButtons = (props) => (
  <ButtonGroup>
    <Button
      className='loadExampleDocument'
      onClick={() =>
        props.editorActions.replaceDocument(exampleDocument, false)
      }
    >
      Load Example
    </Button>
    <Button
      appearance='primary'
      onClick={() =>
        props.editorActions
          .getValue()
          .then(value => console.log(value))
      }
    >
      Publish
    </Button>
    <Button appearance='subtle' onClick={() => props.editorActions.clear()}>
      Close
    </Button>
  </ButtonGroup>
)

// const quickInsertProvider = quickInsertProviderFactory()

class ExampleEditorFullPage extends React.Component {
  render () {
    return (
      <Wrapper>
        <Content>
          <ToolsDrawer
            renderEditor={({ mediaProvider, imageUploadProvider, enabledFeatures, onChange, mediaPicker }) => (
              <Editor
                // defaultValue={this.props.defaultValue}
                appearance='full-width'
                // analyticsHandler={analyticsHandler}
                allowAnalyticsGASV3
                // quickInsert={{
                //   provider: Promise.resolve(quickInsertProvider),
                // }}
                // allowBlockType={{ exclude: [] }}
                allowCodeBlocks={{ enableKeybindingsForIDE: true }}
                allowBreakout
                allowTextColor
                allowTextAlignment
                allowIndentation
                allowTables={{
                  advanced: true
                }}
                allowJiraIssue
                allowPanel
                allowStatus
                allowExtension={{
                  allowBreakout: true
                }}
                allowRule
                allowDate
                allowLayouts
                allowTemplatePlaceholders={{ allowInserting: true }}
                // UNSAFE_cards={{
                //   provider: Promise.resolve(cardProvider),
                // }}
                // activityProvider={activityProvider}
                // mentionProvider={mentionProvider}
                // emojiProvider={emojiProvider}
                // taskDecisionProvider={taskDecisionProvider}
                // contextIdentifierProvider={contextIdentifierProvider}
                // macroProvider={Promise.resolve(macroProvider)}
                media={{
                  provider: mediaProvider,
                  allowMediaSingle: true,
                  allowResizing: enabledFeatures.imageResizing,
                  customMediaPicker: mediaPicker
                }}
                allowDynamicTextSizing={enabledFeatures.dynamicTextSizing}
                placeholder='Write something...'
                shouldFocus={false}
                onChange={onChange}
                // disabled={disabled}
                primaryToolbarComponents={
                  <WithEditorActions
                    render={actions => (
                      <SaveAndCancelButtons editorActions={actions} />
                    )}
                  />
                }
                onSave={SAVE_ACTION}
                // insertMenuItems={customInsertMenuItems}
                // extensionHandlers={extensionHandlers}
                fullWidthMode
                waitForMediaUpload
              />
            )}
          />
        </Content>
      </Wrapper>
    )
  }
}

function Example (props) {
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <ExampleEditorFullPage />
        <DevTools />
      </div>
    </EditorContext>
  )
}

render(
  <Example />,
  document.getElementById('root')
)

