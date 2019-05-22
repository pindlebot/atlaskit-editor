import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import Button from '@atlaskit/button'
import Tooltip from '@atlaskit/tooltip'
import { Context, ContextFactory } from '@atlaskit/media-core'
// import { MediaFile, UploadParams } from '@atlaskit/media-picker'
import { Content, ButtonGroup } from './styles'
import {
  AnalyticsContext,
  AnalyticsListener,
} from '@atlaskit/analytics-next'
import { toJSON } from './utils'
import { BrowserImpl } from '@atlaskit/media-picker/components/browser'
console.log(BrowserImpl)

export const userAuthProviderBaseURL = 'http://localhost:3000'

export const imageUploadHandler = () => {
  console.log('imageUploadHandler')
}

const cachedAuths = {}

const requestAuthProvider = async (
  authEnvironment,
  collectionName,
) => {
  const url = `http://localhost:3000/auth?environment=${authEnvironment}`
  const body = JSON.stringify({
    access: accessUrns[collectionName]
  })
  const headers = new Headers()

  headers.append('Content-Type', 'application/json charset=utf-8')
  headers.append('Accept', 'text/plain, */* q=0.01')

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
    credentials: 'include',
  })

  return response.json()
}


export const mediaPickerAuthProvider = (authEnvironment = 'clientId') => (
  context,
) => {
  const collectionName = (context && context.collectionName) || defaultCollectionName
  authEnvironment = authEnvironment === 'clientId' ? 'clientId' : ''
  const cacheKey = `${collectionName}:${authEnvironment}`

  if (!cachedAuths[cacheKey]) {
    cachedAuths[cacheKey] = requestAuthProvider(
      authEnvironment,
      collectionName,
    )
  }
  return cachedAuths[cacheKey]
}

export const defaultMediaPickerAuthProvider = () => {
  const auth = {
    clientId: 'a89be2a1-f91f-485c-9962-a8fb25ccfa13',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhODliZTJhMS1mOTFmLTQ4NWMtOTk2Mi1hOGZiMjVjY2ZhMTMiLCJ1bnNhZmUiOnRydWUsImlhdCI6MTQ3MzIyNTEzNn0.6Isj5jKgKzWDnPqfoMLiC_LVIlGM8kg_wxG6eGGwhTw',
    baseUrl: userAuthProviderBaseURL,
  }

  return Promise.resolve(auth)
}

const defaultCollectionName = 'collection'

export function storyMediaProviderFactory(mediaProviderFactoryConfig = {}) {
  const {
    collectionName = '',
    includeUploadContext = true,
    includeUserAuthProvider = false,
    useMediaPickerAuthProvider = true,
  } = mediaProviderFactoryConfig
  const collection = collectionName || defaultCollectionName
  const context = ContextFactory.create({
    authProvider: defaultMediaPickerAuthProvider(),
    userAuthProvider: defaultMediaPickerAuthProvider(),
  })

  console.log(context)

  return Promise.resolve({
    featureFlags: {},
    uploadParams: { collection },
    viewContext: Promise.resolve(context),
    uploadContext: Promise.resolve(context),
  })
}

const rejectedPromise = Promise.reject(
  new Error('Simulated provider rejection'),
)

const pendingPromise = new Promise(() => {})

// https://pug.jira-dev.com
const testCloudId = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5'

const teamMentionConfig = {
  url: 'https://api-private.stg.atlassian.com/teams/mentions',
  productId: 'micros-group/confluence'
}

const userMentionConfig = {
  url: `https://api-private.stg.atlassian.com/mentions/${testCloudId}`,
  productId: 'micros-group/confluence',
}

const providers = {
  mediaProvider: {
    resolved: storyMediaProviderFactory()
  }
}

const media = providers.mediaProvider.resolved.then(provider => {
  const { uploadContext } = provider
  uploadContext.then(({ mediaStore }) => {
    setTimeout(() => {
      console.log(mediaStore)
    }, 10 * 1000)
  })
})

rejectedPromise.catch(() => {})

const enabledFeatureNames = {
  dynamicTextSizing: 'dynamic text sizing',
  imageResizing: 'image resizing',
}

export default class ToolsDrawer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      reloadEditor: false,
      editorEnabled: true,
      imageUploadProvider: 'resolved',
      mentionProvider: 'resolved',
      mediaProvider: 'resolved',
      emojiProvider: 'resolved',
      taskDecisionProvider: 'resolved',
      contextIdentifierProvider: 'resolved',
      activityProvider: 'resolved',
      jsonDocument: '{}',
      mediaMockEnabled: false,
      enabledFeatures: {
        dynamicTextSizing: false,
        imageResizing: false,
      },
    }

    if (this.state.mediaMockEnabled) {
      mediaMock.enable()
    }

    this.mediaPicker = new BrowserImpl(context, pickerConfig)
  }

  switchProvider = (providerType, providerName) => {
    this.setState({ [providerType]: providerName })
  }

  reloadEditor = () => {
    this.setState({ reloadEditor: true }, () => {
      this.setState({ reloadEditor: false })
    })
  }

  toggleDisabled = () =>
    this.setState(prevState => ({ editorEnabled: !prevState.editorEnabled }))

  toggleMediaMock = () => {
    // eslint-disable-next-line no-unused-expressions
    this.state.mediaMockEnabled ? mediaMock.disable() : mediaMock.enable()
    this.setState(prevState => ({
      mediaMockEnabled: !prevState.mediaMockEnabled,
    }))
  }

  onChange = (editorView) => {
    this.setState({
      jsonDocument: JSON.stringify(toJSON(editorView.state.doc), null, 2),
    })
  }

  toggleFeature = (name) => {
    this.setState(prevState => ({
      ...prevState,

      enabledFeatures: {
        ...prevState.enabledFeatures,
        [name]: !prevState.enabledFeatures[name],
      },
    }))
  }

  render() {
    const {
      mentionProvider,
      emojiProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
      mediaProvider,
      activityProvider,
      imageUploadProvider,
      jsonDocument,
      reloadEditor,
      editorEnabled,
      mediaMockEnabled,
      enabledFeatures,
    } = this.state
    return (
      <AnalyticsListener
        channel="atlaskit"
        onEvent={(e) => console.log(e)}
      >
        <AnalyticsListener channel="media" onEvent={(e) => console.log(e)}>
          <AnalyticsListener
            channel="fabric-elements"
            onEvent={(e) => console.log(e)}
          >
            <Content>
              {reloadEditor
                ? ''
                : this.props.renderEditor({
                    disabled: !editorEnabled,
                    enabledFeatures,
                    mediaProvider: providers.mediaProvider[mediaProvider],
                    onChange: this.onChange,
                    mediaPicker: this.mediaPicker
                  })}
              <div className="toolsDrawer">
                {(Object.keys(providers)).map(
                  providerKey => (
                    <div key={providerKey}>
                      <ButtonGroup>
                        <label>{providerKey}: </label>
                        {Object.keys(providers[providerKey]).map(
                          providerStateName => (
                            <Button
                              key={`${providerKey}-${providerStateName}`}
                              onClick={this.switchProvider.bind(
                                this,
                                providerKey,
                                providerStateName,
                              )}
                              className={`${providerKey}-${providerStateName
                                .replace(/[()]/g, '')
                                .replace(/ /g, '-')}`}
                              appearance={
                                providerStateName === this.state[providerKey]
                                  ? 'primary'
                                  : 'default'
                              }
                              spacing="compact"
                            >
                              {providerStateName}
                            </Button>
                          ),
                        )}
                      </ButtonGroup>
                    </div>
                  ),
                )}
                <div>
                  <ButtonGroup>
                    <Button onClick={this.toggleDisabled} spacing="compact">
                      {this.state.editorEnabled
                        ? 'Disable editor'
                        : 'Enable editor'}
                    </Button>
                    <Button
                      onClick={this.reloadEditor}
                      spacing="compact"
                      className="reloadEditorButton"
                    >
                      Reload Editor
                    </Button>

                    {(Object.keys(enabledFeatureNames)).map(key => (
                      <Button
                        key={key}
                        onClick={() => this.toggleFeature(key)}
                        spacing="compact"
                        className={`toggleFeature-${key} ${
                          this.state.enabledFeatures[key] ? 'disable' : 'enable'
                        }Feature-${key}`}
                      >
                        {this.state.enabledFeatures[key]
                          ? `Disable ${enabledFeatureNames[key]}`
                          : `Enable ${enabledFeatureNames[key]}`}
                      </Button>
                    ))}

                    <Tooltip content="Hot reload is not supported. Enable or disable before opening media-picker">
                      <Button
                        onClick={this.toggleMediaMock}
                        appearance={mediaMockEnabled ? 'primary' : 'default'}
                        spacing="compact"
                        className="mediaPickerMock"
                      >
                        {mediaMockEnabled ? 'Disable' : 'Enable'} Media-Picker
                        Mock
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </div>
              </div>
              <div className="json-output">
                <legend>JSON output:</legend>
                <pre>{jsonDocument}</pre>
              </div>
            </Content>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    )
  }
}
