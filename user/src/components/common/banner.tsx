import { PureComponent } from 'react';
import { Carousel } from 'antd';

interface IProps {
  banners?: any;
  autoplay?: any;
  arrows?: boolean;
  dots?: boolean;
  swipeToSlide?: boolean;
}

export class Banner extends PureComponent<IProps> {
  render() {
    const {
      banners, autoplay = false, arrows = false, dots = false, swipeToSlide = true
    } = this.props;
    return (
      <div>
        {banners && banners.length > 0
        && (
        <Carousel autoplay={autoplay} swipeToSlide={swipeToSlide} arrows={arrows} dots={dots}>
          {banners.map((item) => (
            <a key={item._id} href={item.link} target="_blank" rel="noreferrer">
              <img src={item.photo && item.photo.url} alt="" key={item._id} />
            </a>
          ))}
        </Carousel>
        )}
      </div>

    );
  }
}
