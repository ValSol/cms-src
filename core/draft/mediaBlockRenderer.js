import React from 'react';

import AudioEntity from './components/AudioEntity';
import ImageEntity from './components/ImageEntity';
import VideoEntity from './components/VideoEntity';

const Media = props => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  let media;
  if (type === 'AUDIO') {
    media = <AudioEntity {...data} />;
  } else if (type === 'IMAGE') {
    media = <ImageEntity {...data} />;
  } else if (type === 'VIDEO') {
    media = <VideoEntity {...data} />;
  }
  return media;
};

const mediaBlockRenderer = block => {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
};

export default mediaBlockRenderer;
