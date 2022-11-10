import React, { useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Add, PauseCircle, PlayCircle, Remove, VolumeOff, VolumeUp } from '@mui/icons-material';
import { Slider } from '@mui/material';

const App = () => {
  const audioRef = useRef();
  const durationRef = useRef();
  const volumeValueRef = useRef();

  const [state, setState] = useState({
    isPlay: true,
    slide: 0,
    mute: false,
    volume: 0,
    playbackSpeed: 1,
  })

  useEffect(() => {
    const secondsTimer = setInterval(() => {
      if (durationRef.current) {
        let seconds = Math.round(audioRef?.current?.audio?.current?.currentTime);
        let duration = Math.round(audioRef?.current?.audio?.current?.duration);
        let value = (seconds / duration) * 100
        setState(prev => ({ ...prev, slide: value }));
        let secondFormat = new Date(seconds * 1000).toISOString().slice(11, 19);
        let durationFormat = new Date(duration * 1000).toISOString().slice(11, 19);
        durationRef.current.innerText = `${secondFormat} / ${durationFormat}`
      }
    }, 1000);
    return () => clearInterval(secondsTimer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      setState(prev => ({ ...prev, volume: Math.round(audioRef.current.audio.current.volume * 100) }))
    }
  }, [audioRef.current]);

  const onChangeSlide = ({ target: { value } }) => {
    setState(prev => ({ ...prev, slide: value }));
  }

  const onVolumeChange = ({ target: { value } }) => {
    setState(prev => ({ ...prev, volume: value }))
    audioRef.current.audio.current.volume = value / 100
    if (value === 0) {
      setState(prev => ({ ...prev, mute: true }));
    } else {
      setState(prev => ({ ...prev, mute: false }));
    }
  }

  const onSlideRelease = (e, newValue) => {
    if (audioRef.current.audio.current) {
      let duration = audioRef.current.audio.current.duration
      let durationInOne = (duration / 100)
      let newDuration = newValue * durationInOne;
      audioRef.current.audio.current.currentTime = newDuration;
    }
  }

  const togglePlay = (bool) => {
    setState(prev => ({ ...prev, isPlay: bool }))
    if (bool) {
      audioRef.current.audio.current.pause()
    } else {
      audioRef.current.audio.current.play()
    }
  }

  const increasePlaybackSpeed = () => {
    if (audioRef.current.audio.current) {
      if (audioRef.current.audio.current.playbackRate < 2) {
        audioRef.current.audio.current.playbackRate = audioRef.current.audio.current.playbackRate + 0.25
        volumeValueRef.current.innerText = `${audioRef.current.audio.current.playbackRate}x`
      }
    }
  }

  const decreasePlaybackSpeed = () => {
    if (audioRef.current.audio.current) {
      if (audioRef.current.audio.current.playbackRate > 0.25) {
        audioRef.current.audio.current.playbackRate = audioRef.current.audio.current.playbackRate - 0.25
        volumeValueRef.current.innerText = `${audioRef.current.audio.current.playbackRate}x`
      }
    }
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-[#121212]'>
      <AudioPlayer
        style={{ display: 'none' }}
        ref={audioRef}
        volume={0.5}
        src={"https://content.blubrry.com/takeituneasy/lex_ai_balaji_srinivasan.mp3"}
      />
      <div className='bg-white/[.12] w-[95%] lg:w-[80%] h-[15%] rounded-xl flex items-center'>
        <div className='w-[30%] md:w-[20%] lg:w-[10%] h-[100%] flex justify-center items-center'>
          {state.isPlay
            ? <PlayCircle style={{ width: 'auto', height: '80%', color: 'white', cursor: 'pointer' }} onClick={() => togglePlay(false)} />
            : <PauseCircle style={{ width: 'auto', height: '80%', color: 'white', cursor: 'pointer' }} onClick={() => togglePlay(true)} />}
        </div>
        <div className='w-[90%] h-[100%] p-5'>
          <div className='w-[100%] h-[50%]'>
            <Slider onChangeCommitted={onSlideRelease} value={state.slide} onChange={onChangeSlide} size='medium' style={{ width: '99%', marginLeft: '10px', color: 'rgba(255, 255, 255, 1)', height: '40%' }} />
          </div>
          <div className='w-[100%] h-[50%] flex justify-between'>
            <div className='flex items-center w-[50%]'>
              <div className='w-[25px] h-[25px] flex justify-center items-center rounded-[5px] ml-[10px]'>
                <p ref={volumeValueRef} style={{ color: 'white' }}>1x</p>
              </div>
              <div style={{border: '1.8px solid white'}} className='w-[25px] h-[25px] flex justify-center items-center rounded-[5px] ml-[20px] cursor-pointer' onClick={increasePlaybackSpeed}>
                <Add style={{ color: 'white', fontWeight: '100', fontSize: 20 }} />
              </div>
              <div style={{border: '1.8px solid white'}} className='w-[25px] h-[25px] flex justify-center items-center rounded-[5px] ml-[10px] cursor-pointer' onClick={decreasePlaybackSpeed}>
                <Remove style={{ color: 'white', fontWeight: '100', fontSize: 20 }} />
              </div>
              <div className='flex ml-[20px] group justify-center items-center'>
                {state.mute
                  ? <VolumeOff style={{ color: 'white' }} />
                  : <VolumeUp style={{ color: 'white' }} />
                }
                <div className='flex opacity-0 justify-center items-center group-hover:opacity-100 transition-all'>
                  <Slider value={state.volume} onChange={onVolumeChange} size='small' style={{ width: '8vw', marginLeft: '10%', color: 'rgba(255, 255, 255, 1)', height: '15%' }} />
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} ref={durationRef}>{'00:00:00'} / {'00:00:00'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;