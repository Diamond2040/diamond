export interface IAbuseReport {
  [T: string]: {
    _id: string;
    text: string,
    senderSource: string,
    senderId: string;
    senderInfo?: any;
    createdAt: Date;
  }
}

export type IAbuseReportResponse = {
  _id?: string;

  sourceId: string;

  sourceInfo?: any;

  targetId: string;

  targetInfo?: any;

  chatLog: IAbuseReport;

  category: string;

  type: string;

  comment: string;

  createdAt?: Date;

  updatedAt?: Date;
};
