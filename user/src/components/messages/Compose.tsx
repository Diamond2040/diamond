import { PureComponent, createRef } from 'react';
import { connect } from 'react-redux';
import { sendMessage, sentFileSuccess, updateLastMessage } from '@redux/message/actions';
import { SmileOutlined, SendOutlined } from '@ant-design/icons';
import { ImageMessageUpload } from '@components/messages/uploadPhoto';
import { authService, messageService } from '@services/index';
import { Emotions } from './emotions';
import './Compose.less';

interface IProps {
  sendMessage: Function;
  sentFileSuccess: Function;
  updateLastMessage: Function;
  sendMessageStatus: any;
  conversation: any;
  currentUser: any;
  disabled?: boolean;
}

class Compose extends PureComponent<IProps> {
  _input: any;

  state = {
    text: '',
    visibleEmotions: false
  };

  componentDidMount() {
    if (!this._input) this._input = createRef();
  }

  componentDidUpdate(previousProps) {
    const { sendMessageStatus } = this.props;
    if (previousProps.sendMessageStatus.success !== sendMessageStatus.success) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ text: '' });
    }
  }

  onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      this.send();
    }
  };

  onChange = (evt) => {
    this.setState({ text: evt.target.value });
  };

  onEmojiClick = (emoji) => {
    const { disabled } = this.props;
    if (disabled) return;
    const { text } = this.state;
    this.setState({ text: `${`${text} ${emoji}`} ` });
  }

  onPhotoUploaded = (data: any) => {
    if (!data || !data.response) {
      return;
    }
    const { conversation, sentFileSuccess: handleSentFile, updateLastMessage: dispatchUpdateLastMessage } = this.props;
    const imageUrl = (data.response.data && data.response.data.imageUrl) || data.base64;
    handleSentFile({ ...data.response.data, ...{ imageUrl } });
    dispatchUpdateLastMessage({ conversationId: conversation._id, message: 'sent a photo' });
  }

  send() {
    const { text } = this.state;
    const { conversation, disabled, sendMessage: handleSend } = this.props;
    if (!text || disabled) return;
    handleSend({
      conversationId: conversation._id,
      data: {
        text
      }
    });
  }

  render() {
    const { text, visibleEmotions } = this.state;
    const {
      sendMessageStatus: status, conversation, disabled
    } = this.props;
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    if (!this._input) this._input = createRef();
    return (
      <>
        <div className="compose">
          <textarea
            value={text}
            className="compose-input"
            placeholder="Write your message..."
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            disabled={disabled || status.sending || !conversation._id}
            ref={(c) => { this._input = c; }}
          />
          <div className="grp-icons">
            <div className="grp-emotions">
              <SmileOutlined onClick={() => this.setState({ visibleEmotions: !visibleEmotions })} />
            </div>
            {visibleEmotions
        && <Emotions onEmojiClick={this.onEmojiClick.bind(this)} onClickOutSide={() => this.setState({ visibleEmotions: false })} />}
          </div>
          <div className="grp-icons">
            <div className="grp-file-icon">
              <ImageMessageUpload
                disabled={disabled}
                headers={uploadHeaders}
                uploadUrl={messageService.getMessageUploadUrl(conversation?._id)}
                onUploaded={this.onPhotoUploaded}
                options={{ fieldName: 'message-photo' }}
                messageData={{
                  text: 'sent a photo',
                  conversationId: conversation && conversation._id
                }}
              />
            </div>
          </div>
          <div className="grp-icons" style={{ paddingRight: 0 }}>
            <div aria-hidden className="grp-send" onClick={this.send.bind(this)}>
              <SendOutlined />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  sendMessageStatus: state.message.sendMessage,
  currentUser: state.user.current
});

const mapDispatch = { sendMessage, sentFileSuccess, updateLastMessage };
export default connect(mapStates, mapDispatch)(Compose);
