import { useEffect, useRef, useState } from 'react';
import { Image, Carousel, Spin } from 'antd';
import { ZoomInOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './profile-images-carousel.less';
import { performerService } from '@services/performer.service';

interface IProps {
  performerId: string;
}

export function ProfileImagesCarousel({ performerId }: IProps) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const mainCarouselRef = useRef(null);

  const getImages = async () => {
    try {
      setLoading(true);
      const resp = await performerService.allProfileImages(performerId);
      setImages(resp.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getThumb = (image) => {
    if (image.file?.thumbnails?.length) {
      return image.file.thumbnails[0];
    }

    return image.file?.fileUrl;
  };

  const changePos = (pos) => {
    mainCarouselRef.current?.goTo(pos);
  };

  useEffect(() => {
    getImages();
  }, [performerId]);

  if (loading) {
    return (
      <div className="profile-carousel">
        <Spin size="large" />
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="profile-carousel">
        <div className="carousel-main">
          <div className="content-inner">
            <Image src="/no-avatar.png" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-carousel">
      <div className="carousel-main">
        <Image.PreviewGroup>
          <Carousel
            dots={false}
            adaptiveHeight
            effect="fade"
            slidesToShow={1}
            arrows
            ref={mainCarouselRef}
          >
            {images.map((image) => (
              <div className="content-inner" key={image._id}>
                <Image
                  src={image.file.fileUrl}
                  preview={{
                    mask: (
                      <div className="click-to-enlarge">
                        <ZoomInOutlined />
                        {' '}
                        Click to enlarge
                      </div>
                    )
                  }}
                />
              </div>
            ))}
          </Carousel>
        </Image.PreviewGroup>
      </div>
      {images.length > 1 && (
        <div className="carousel-thumbs">
          <Carousel
            dots={false}
            slidesToShow={4}
            arrows
            infinite={false}
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            {images.map((image, index) => (
              <Image
                key={image._id}
                preview={false}
                onClick={() => changePos(index)}
                src={getThumb(image)}
                alt="thumb"
              />
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}
