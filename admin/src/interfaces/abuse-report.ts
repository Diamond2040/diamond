export interface IAbuseReportLogs {
  [T: string]: {
    _id: string;
    text: string,
    senderSource: string,
    senderId: string;
    senderInfo?: any;
    createdAt: Date;
  }
}

export type IAbuseReport = {
  _id?: string;

  sourceId: string;

  sourceInfo?: any;

  targetId: string;

  targetInfo?: any;

  category: string;

  type: string;

  comment: string;

  createdAt?: Date;

  updatedAt?: Date;
};
