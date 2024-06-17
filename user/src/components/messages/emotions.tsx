import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { useEffect, useRef } from 'react';

interface IProps {
  onEmojiClick: Function;
  // eslint-disable-next-line react/require-default-props
  onClickOutSide?: Function;
  // eslint-disable-next-line react/require-default-props
  siteName?: string;
}

export function Emotions({
  siteName = '',
  onEmojiClick = function onClick() {},
  onClickOutSide = function clickOutside() {}
}: IProps) {
  const wrapperRef = useRef(null);

  const handleClickEmoji = (emoji) => {
    onEmojiClick(emoji.native);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      onClickOutSide();
    }
  };

  // below is the same as componentDidMount and componentDidUnmount
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <Picker onClick={handleClickEmoji} showSkinTones title={siteName || ''} />
    </div>
  );
}

export default Emotions;
