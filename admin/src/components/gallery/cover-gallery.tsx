import { PureComponent } from 'react';
import { IGallery } from 'src/interfaces';

interface IProps {
  gallery?: IGallery;
  style?: Record<string, string>;
}

export class CoverGallery extends PureComponent<IProps> {
  render() {
    const { gallery, style } = this.props;
    const { coverPhoto } = gallery;
    const url = (coverPhoto && coverPhoto?.thumbnails[0]) || (coverPhoto && coverPhoto?.url) || '/gallery.png';
    return <img src={url} style={style || { width: 50 }} alt="style" />;
  }
}
