import { PureComponent, createRef } from 'react';
import { Spin, Button, Avatar } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { loadMoreMessages, deactiveConversation } from '@redux/message/actions';
import { IConversation, IUser } from '@interfaces/index';
import Compose from './Compose';
import Message from './Message';
import './MessageList.less';

interface IProps {
  sendMessage: any;
  deactiveConversation: Function;
  loadMoreMessages: Function;
  message: any;
  conversation: IConversation;
  currentUser: IUser;
  loggedIn: boolean;
}

class MessageList extends PureComponent<IProps> {
  messagesRef: any;

  state = {
    offset: 0,
    onloadmore: false
  }

  async componentDidMount() {
    if (!this.messagesRef) this.messagesRef = createRef();
  }

  async componentDidUpdate(prevProps) {
    const { conversation, message } = this.props;
    const { onloadmore } = this.state;
    if (prevProps.conversation && prevProps?.conversation._id !== conversation?._id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ offset: 0 });
    }
    if ((prevProps.message.nonce !== message.items.nonce)) {
      if (onloadmore) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ onloadmore: false });
      } else {
        this.scrollToBottom();
      }
    }
  }

  async handleScroll(conversation, event) {
    const { message, loadMoreMessages: handleLoadMore } = this.props;
    const { offset } = this.state;
    const { fetching, items, total } = message;
    const canloadmore = total > items.length;
    const ele = event.target;
    if (!canloadmore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canloadmore) {
      this.setState({ offset: offset + 1, onloadmore: true },
        () => {
          const { offset: newOffset } = this.state;
          handleLoadMore({ conversationId: conversation._id, limit: 25, offset: newOffset * 25 });
        });
    }
  }

 renderMessages = () => {
   const { message, currentUser, conversation } = this.props;
   const recipientInfo = conversation && conversation.recipientInfo;
   const messages = message.items;
   let i = 0;
   const messageCount = messages.length;
   const tempMessages = [];
   while (i < messageCount) {
     const previous = messages[i - 1];
     const current = messages[i];
     const next = messages[i + 1];
     const isMine = current.senderId === currentUser._id;
     const currentMoment = moment(current.createdAt);
     let prevBySameAuthor = false;
     let nextBySameAuthor = false;
     let startsSequence = true;
     let endsSequence = true;
     let showTimestamp = true;

     if (previous) {
       const previousMoment = moment(previous.createdAt);
       const previousDuration = moment.duration(
         currentMoment.diff(previousMoment)
       );
       prevBySameAuthor = previous.senderId === current.senderId;

       if (prevBySameAuthor && previousDuration.as('hours') < 1) {
         startsSequence = false;
       }

       if (previousDuration.as('hours') < 1) {
         showTimestamp = false;
       }
     }

     if (next) {
       const nextMoment = moment(next.createdAt);
       const nextDuration = moment.duration(nextMoment.diff(currentMoment));
       nextBySameAuthor = next.senderId === current.senderId;

       if (nextBySameAuthor && nextDuration.as('hours') < 1) {
         endsSequence = false;
       }
     }
     if (current._id) {
       tempMessages.push(
         <Message
           key={i}
           isMine={isMine}
           startsSequence={startsSequence}
           endsSequence={endsSequence}
           showTimestamp={showTimestamp}
           data={current}
           recipient={recipientInfo}
           currentUser={currentUser}
         />
       );
     }
     // Proceed to the next message.
     i += 1;
   }
   return tempMessages;
 };

 scrollToBottom(toBot = true) {
   const { message: { fetching } } = this.props;
   const { offset } = this.state;
   if (!fetching && this.messagesRef && this.messagesRef.current) {
     const ele = this.messagesRef.current;
     window.setTimeout(() => {
       ele.scrollTop = toBot ? ele.scrollHeight + 100 : (ele.scrollHeight / (offset + 1) - 100);
     }, 500);
   }
 }

 render() {
   const {
     conversation, message, deactiveConversation: handleDeactiveConversation, loggedIn
   } = this.props;
   const { fetching } = message;
   return (
     <div className="message-list" ref={this.messagesRef} onScroll={this.handleScroll.bind(this, conversation)}>
       {conversation && conversation._id
         ? (
           <>
             <div className="message-list-container">
               <div className="mess-recipient">
                 <span>
                   <Avatar alt="avatar" src={conversation?.recipientInfo?.avatar || '/no-avatar.png'} />
                   {' '}
                   {conversation?.recipientInfo?.name || conversation?.recipientInfo?.username || 'N/A'}
                 </span>
                 <Button onClick={() => handleDeactiveConversation()} className="close-btn">
                   <ArrowLeftOutlined />
                   {' '}
                 </Button>
               </div>
               {fetching && <div className="text-center"><Spin /></div>}
               {this.renderMessages()}
             </div>
             <Compose disabled={!loggedIn} conversation={conversation} />
           </>
         )
         : <p className="text-center">Click on conversation to start</p>}
     </div>
   );
 }
}

const mapStates = (state: any) => {
  const { conversationMap, sendMessage } = state.message;
  const { activeConversation } = state.conversation;
  const messages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].items || []
    : [];
  const totalMessages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].total || 0
    : 0;
  const fetching = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].fetching || false : false;
  return {
    sendMessage,
    message: {
      items: messages,
      total: totalMessages,
      fetching,
      nonce: Math.random()
    },
    conversation: activeConversation,
    currentUser: state.user.current,
    loggedIn: state.auth.loggedIn
  };
};

const mapDispatch = { loadMoreMessages, deactiveConversation };
export default connect(mapStates, mapDispatch)(MessageList);
