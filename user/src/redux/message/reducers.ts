import { merge, uniq } from 'lodash';
import { createReducers } from '@lib/redux';
import { IReduxAction } from 'src/interfaces';
import {
  getConversations,
  getConversationsSuccess,
  getConversationsFail,
  searchConversations,
  searchConversationsSuccess,
  searchConversationsFail,
  setActiveConversationSuccess,
  fetchingMessage,
  loadMessagesSuccess,
  sendMessage,
  sendMessageSuccess,
  sendMessageFail,
  getConversationDetailSuccess,
  receiveMessageSuccess,
  readMessages,
  sentFileSuccess,
  loadMoreMessagesSuccess,
  deactiveConversation,
  resetConversationState,
  updateLastMessage,
  updateTotalConversationNotification
} from './actions';

const initialConversationState = {
  list: {
    requesting: false,
    error: null,
    data: [],
    total: 0,
    success: false
  },
  mapping: {},
  activeConversation: {}
};

const initialMessageState = {
  conversationMap: {},
  sendMessage: {},
  receiveMessage: {}
};

const conversationReducer = [
  {
    on: resetConversationState,
    reducer() {
      return {
        ...initialConversationState
      };
    }
  },
  {
    on: getConversations,
    reducer(state: any) {
      const nextState = { ...state };
      nextState.list.requesting = true;
      return {
        ...nextState
      };
    }
  },
  {
    on: getConversationsSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      const { list, mapping } = nextState;
      const { data: items, total } = data.payload;
      const Ids = items.map((c) => c._id);
      list.data = uniq(list.data.concat(Ids));
      list.total = total;
      list.success = true;
      list.requesting = false;
      list.error = false;
      items.forEach((c) => {
        if (typeof c.lastMessageCreatedAt === 'string') {
          // eslint-disable-next-line no-param-reassign
          c.lastMessageCreatedAt = new Date(c.lastMessageCreatedAt);
        }
        mapping[c._id] = c;
      });

      return {
        ...nextState
      };
    }
  },
  {
    on: getConversationsFail,
    reducer(state: any) {
      const nextState = { ...state };
      return {
        ...nextState,
        ...initialConversationState
      };
    }
  },
  {
    on: searchConversations,
    reducer(state: any) {
      const nextState = { ...state };
      return {
        ...nextState,
        list: {
          requesting: true,
          error: null,
          data: [],
          total: 0,
          success: false
        },
        mapping: {},
        activeConversation: {}
      };
    }
  },
  {
    on: searchConversationsSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      const { list, mapping } = nextState;
      const { data: items, total } = data.payload;
      const Ids = items.map((c) => c._id);
      list.data = Ids;
      list.total = total;
      list.success = true;
      list.requesting = false;
      list.error = false;
      items.forEach((c) => {
        if (typeof c.lastMessageCreatedAt === 'string') {
          // eslint-disable-next-line no-param-reassign
          c.lastMessageCreatedAt = new Date(c.lastMessageCreatedAt);
        }

        mapping[c._id] = c;
      });
      return {
        ...nextState
      };
    }
  },
  {
    on: searchConversationsFail,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      return {
        ...nextState,
        list: {
          requesting: false,
          error: data.payload,
          data: [],
          total: 0,
          success: false
        },
        mapping: {},
        activeConversation: {}
      };
    }
  },
  {
    on: setActiveConversationSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const conversation = data.payload;
      const list = state.list.data;
      const { mapping } = state;
      const check = list.find((c) => c === conversation._id);
      if (!check) {
        list.unshift(conversation._id);
        mapping[conversation._id] = conversation;
      }
      return {
        ...state,
        activeConversation: conversation
      };
    }
  },
  {
    on: getConversationDetailSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const { list, mapping } = state;
      const conversation = data.payload;
      if (!list.data.includes(conversation._id)) {
        list.data.unshift(conversation._id);
        mapping[conversation._id] = conversation;
      }
      return {
        ...state
      };
    }
  },
  {
    on: readMessages,
    reducer(state: any, data: IReduxAction<any>) {
      const conversationId = data.payload;
      const { mapping } = state;
      mapping[conversationId].totalNotSeenMessages = 0;
      return {
        ...state
      };
    }
  },
  {
    on: deactiveConversation,
    reducer(state: any) {
      const nextState = { ...state };
      nextState.activeConversation = {};
      return {
        ...nextState
      };
    }
  },
  {
    on: updateLastMessage,
    reducer(state: any, action: IReduxAction<any>) {
      // sort conversation
      const nextState = { ...state };
      const { list } = nextState;
      // move the list to top
      const { conversationId } = action.payload;
      const index = list.data.indexOf(conversationId);
      if (index > 0) {
        list.data.splice(index, 1);
        list.data.splice(0, 0, conversationId);
      }
      return {
        ...nextState,
        mapping: {
          ...state.mapping,
          [action.payload.conversationId]: {
            ...state.mapping[action.payload.conversationId],
            lastMessage: action.payload.message,
            lastMessageCreatedAt: new Date()
          }
        }
      };
    }
  },
  {
    on: updateTotalConversationNotification,
    reducer(state: any, action: IReduxAction<any>) {
      return {
        ...state,
        mapping: {
          ...state.mapping,
          [action.payload]: {
            ...state.mapping[action.payload],
            totalNotSeenMessages: (state.mapping[action.payload].totalNotSeenMessages || 0) + 1
          }
        }
      };
    }
  }
];

const messageReducer = [
  {
    on: fetchingMessage,
    reducer(state: any, data: IReduxAction<any>) {
      const { conversationMap } = state;
      const { conversationId } = data.payload;
      conversationMap[conversationId] = {
        ...conversationMap[conversationId],
        fetching: true
      };
      return { ...state };
    }
  },
  {
    on: loadMessagesSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const { conversationMap } = state;
      const { conversationId, items, total } = data.payload;
      conversationMap[conversationId] = {
        items: [...items.reverse()],
        total,
        fetching: false
      };
      return { ...state };
    }
  },
  {
    on: loadMoreMessagesSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const { conversationMap } = state;
      const { conversationId, items, total } = data.payload;
      conversationMap[conversationId] = {
        items: [
          ...items.reverse(),
          ...conversationMap[conversationId].items || []
        ],
        total,
        fetching: false
      };
      return { ...state };
    }
  },
  {
    on: sendMessage,
    reducer(state: any) {
      return {
        ...state,
        sendMessage: {
          sending: true
        }
      };
    }
  },
  {
    on: sendMessageSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      if (!nextState.conversationMap[data.payload.conversationId] || !nextState.conversationMap[data.payload.conversationId].items) {
        nextState.conversationMap[data.payload.conversationId].items = [];
      }
      nextState.conversationMap[data.payload.conversationId] = {
        ...nextState.conversationMap[data.payload.conversationId],
        items: [...nextState.conversationMap[data.payload.conversationId].items, data.payload],
        total: nextState.conversationMap[data.payload.conversationId].total + 1,
        fetching: false
      };

      return {
        ...nextState,
        sendMessage: {
          sending: false,
          success: true,
          data: data.payload
        }
      };
    }
  },
  {
    on: sendMessageFail,
    reducer(state: any, data: IReduxAction<any>) {
      return {
        ...state,
        sendMessage: {
          sending: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: receiveMessageSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      if (!nextState.conversationMap[data.payload.conversationId]) {
        return { ...nextState };
      }
      nextState.conversationMap[data.payload.conversationId].items.push(
        data.payload
      );
      return {
        ...nextState,
        receiveMessage: data.payload
      };
    }
  },
  {
    on: sentFileSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      if (!nextState.conversationMap[data.payload.conversationId] || !nextState.conversationMap[data.payload.conversationId].items) {
        nextState.conversationMap[data.payload.conversationId].items = [];
      }
      nextState.conversationMap[data.payload.conversationId].items.push(
        data.payload
      );
      return {
        ...nextState,
        sendMessage: {
          sending: false,
          success: true,
          data: data.payload
        }
      };
    }
  }
];

export default merge(
  {},
  createReducers(
    'conversation',
    [conversationReducer],
    initialConversationState
  ),
  createReducers('message', [messageReducer], initialMessageState)
);
