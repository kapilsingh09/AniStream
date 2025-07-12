import { useRef } from 'react';
import videojs from 'video.js';
import Player from './Player';
// import src from '../assets/AnimePahe_Kaoru_Hana_wa_Rin_to_Saku_-_01_1080p_KawaSubs.mp4'

const Vdplayer = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
    MutationRecord:false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: src, // Adjust path based on where your video is
        type: 'video/mp4',
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <div className='h-[50vh] w-1/2 flex items-center justify-center'>
    

      <Player options={videoJsOptions} onReady={handlePlayerReady} />
   
    </div>
  );
};

export default Vdplayer;
