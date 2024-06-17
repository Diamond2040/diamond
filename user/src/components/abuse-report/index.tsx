import { checkUserLogin, getResponseError } from '@lib/utils';
import { reportService } from '@services/abuse-report.service';
import { ButtonProps, Button, message } from 'antd';
import React from 'react';
import { IUser } from 'src/interfaces';
import dynamic from 'next/dynamic';
import { AbuseReportModalProps } from './modal';

const AbuseReportModalNoSSR = dynamic<AbuseReportModalProps>(
  () => import('./modal').then((mod) => mod.AbuseReportModal),
  { ssr: false }
);

interface P {
  btnProps: ButtonProps;
  targetId: string;
  targetUsername: string;
  user: IUser;
  loggedIn: boolean;
}

export const AbuseReportContainer = React.memo(
  ({
    btnProps,
    targetId,
    targetUsername,
    user,
    loggedIn
  }: React.PropsWithChildren<P>) => {
    const [values, setValues] = React.useState({});
    const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

    const onClick = () => {
      if (checkUserLogin(loggedIn, user)) {
        setVisibleModal(true);
      } else {
        message.error('Please login to send abuse report');
      }
    };

    const onOk = async () => {
      try {
        await reportService.reportModel({
          targetId,
          category: 'abusive',
          ...values
        });
        message.success('The report has been submitted successfully and the necessary action will be taken!');
      } catch (e) {
        const error = Promise.resolve(e);
        message.error(getResponseError(error));
      } finally {
        setVisibleModal(false);
      }
    };

    const onCancel = () => {
      setVisibleModal(false);
    };

    const onValuesChange = (_, v) => {
      setValues(v);
    };

    return (
      <>
        <AbuseReportModalNoSSR
          width={770}
          centered
          closable
          title={`Report ${targetUsername}`}
          onOk={onOk}
          onCancel={onCancel}
          onValuesChange={onValuesChange}
          visible={visibleModal}
        />
        <Button {...btnProps} onClick={onClick} />
      </>
    );
  }
);
