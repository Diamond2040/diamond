/* eslint-disable react/jsx-indent */
import { notification } from 'antd';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { subscriptionService } from '@services/index';

function NotificationAlert({
  currentUser
}) {
  const checkSubscription = async () => {
    const checkAlert = localStorage.getItem('checkSubscriptionAlert');
    if (checkAlert) return;
    localStorage.setItem('checkSubscriptionAlert', '1');

    const { data } = await subscriptionService.current();
    if (!data) {
      notification.info({
        message: 'Subscription require',
        description: (
          <p>
            No active subscription found, please click
{' '}
            <a href="/model/profile/upgrade-membership">here</a>
{' '}
to make your
            profile public.
          </p>
        ),
        duration: 0
      });
    }
  };

  useEffect(() => {
    if (process.browser && currentUser.roles.includes('performer')) {
      checkSubscription();
    }
  }, [currentUser._id]);

  return null;
}

const mapStateToProps = (state: any) => ({
  currentUser: state.user.current
});

export default connect(mapStateToProps)(NotificationAlert);
