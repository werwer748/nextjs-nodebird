import { CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Slick from 'react-slick';
import { CloseBtn, Global, Header, ImgWrapper, Indicator, Overlay, SlickWrapper } from './styles';

const ImagesZoom = ({ images, onClose, open }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={slide => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map(img => (
              <ImgWrapper key={img.src}>
                <img src={`http://localhost:3065/${img.src}`} alt={img.src} />;
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ImagesZoom;
