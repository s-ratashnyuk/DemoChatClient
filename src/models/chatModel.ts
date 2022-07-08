export type ChatItem = {
  id: number,
  title: string,
  avatar: string,
  unread_count: number,
  last_message_time: string,
  last_message_content: string,
  last_message_author: string
};

export enum MessageTypes {
  IMAGE,
  MY,
  THEIR,
  DL,
}

export type ChatMessage = {
  msg_text: string,
  msg_date: string,
  msg_date_native?: Date,
  msg_type: MessageTypes,
};
