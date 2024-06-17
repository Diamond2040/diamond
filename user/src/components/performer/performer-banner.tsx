import { PureComponent } from 'react';
import { IPerformer } from 'src/interfaces';
import Link from 'next/link';
import './performer-banner.less';
import { Button, message } from 'antd';
import { performerService } from '@services/performer.service';

interface IProps {
  username: string;
}

interface IState {
  performers: IPerformer;
  fetching: boolean;
  profileImages: any[];
}

export class ModelProfileImages extends PureComponent<IProps, IState> {
  state = {
    performers: [] as any,
    fetching: false,
    profileImages: []
  };

  componentDidMount = async () => {
    this.relatedPerformers();
    this.allProfileImages();
  }

  relatedPerformers = async () => {
    const { username } = this.props;
    try {
      await this.setState({ fetching: true });
      const resp = await performerService.relatedPerformers(username);
      this.setState({ performers: resp.data });
    } catch {
      message.error('Error occured, please try again later');
      this.setState({ fetching: false });
    }
  }

  allProfileImages = async () => {
    try {
      await this.setState({ fetching: true });
      const resp = await performerService.allProfileImages();
      this.setState({ profileImages: resp.data });
    } catch {
      message.error('Error occured, please try again later');
      // TODO - redirect to home!
    } finally {
      this.setState({ fetching: false });
    }
  }

  render() {
    const {
      performers, fetching, profileImages
    } = this.state;
    return (
      <>
        <div className="model-banner">
          {profileImages.map((banner) => (
            <a key={banner._id} href="" target="_blank" rel="noreferrer">
              <img src={banner.file.fileUrl && banner.file.thumbnails} alt="" key={banner._id} />
            </a>
          ))}
        </div>
        <div className="related">
          <h1 className="title">Related</h1>
          {performers.length > 0
            && !fetching
            && performers.map((performer: IPerformer) => (
              <div>
                <a key={performer._id} href="" target="_blank" rel="noreferrer">
                  <img src={performer.avatar || 'avata.png'} alt="" key={performer._id} />
                </a>
                <div className="info">
                  <div className="name">{performer?.name}</div>
                  <div className="country">{performer?.country}</div>
                  <div className="aboutMe">{performer?.aboutMe}</div>
                  <div className="button">
                    <Link
                      href={{
                        pathname: '/model/profile',
                        query: { id: performer?.username }
                      }}
                      as={`/model/${performer?.username}`}
                    >
                      <Button>VIEW PROFILE</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }
}
