import React, { useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Add, PauseCircle, PlayCircle, Remove, VolumeOff, VolumeUp, Replay10, Forward30 } from '@mui/icons-material';
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

  const skipBack = () => {
    let tenSec = 10
    if(audioRef.current.audio.current){
      if(audioRef.current.audio.current.currentTime > tenSec){
        audioRef.current.audio.current.currentTime = (audioRef.current.audio.current.currentTime - tenSec)
      }
    }
  }

  const skipForward = () => {
    let thirtySec = 30
    if(audioRef.current.audio.current){
      if((audioRef.current.audio.current.duration - audioRef.current.audio.current.currentTime) > thirtySec){
        audioRef.current.audio.current.currentTime = (audioRef.current.audio.current.currentTime + thirtySec)
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
      <div className='bg-white/[.12] w-[95%] lg:w-[80%] h-[15%] rounded-xl flex justify-center items-center'>
        <div className='w-[10%] lg:w-[10%] h-[100%] flex justify-center items-center'>
          {state.isPlay
            ? <PlayCircle className='scale-[2] md:scale-[2.5] lg:scale-[3] text-white/[0.7] cursor-pointer' onClick={() => togglePlay(false)} />
            : <PauseCircle className='scale-[2] md:scale-[2.5] lg:scale-[3] text-white/[0.7] cursor-pointer' onClick={() => togglePlay(true)} />}
        </div>
        <div className='w-[80%] md:w-[90%] h-[100%] p-2'>
          <div className='w-[100%] h-[50%] py-[10px] md:p-0 justify-end items-center flex'>
            <Slider onChangeCommitted={onSlideRelease} value={state.slide} onChange={onChangeSlide} size='medium' style={{ width: '100%', marginLeft: '10px', color: 'rgba(255, 255, 255, 1)', height: '40%' }} />
          </div>
          <div className='w-[100%] h-[50%] flex justify-between'>
            <div className='flex items-center w-[50%]'>
              <div className='w-[25px] h-[25px] flex justify-center items-center rounded-[5px] ml-[10px]'>
                <p className='text-white/[0.7] text-[10px] md:text-[12px] lg:text-[15px]' ref={volumeValueRef}>1x</p>
              </div>
              <div style={{border: '1.8px solid rgba(255, 255, 255, 0.7)'}} className='w-[20px] md:w-[20px] lg:w-[25px] h-[20px] md:h-[20px] lg:h-[25px] flex justify-center items-center rounded-[5px] ml-[10px] md:ml-[15px] lg:ml-[20px] cursor-pointer' onClick={increasePlaybackSpeed}>
                <Add style={{fontSize: '15px'}} className=' text-white/[0.7] font-light'  />
              </div>
              <div style={{border: '1.8px solid rgba(255, 255, 255, 0.7)'}} className='w-[20px] md:w-[20px] lg:w-[25px] h-[20px] md:h-[20px] lg:h-[25px] flex justify-center items-center rounded-[5px] ml-[10px] md:ml-[15px] lg:ml-[10px] cursor-pointer' onClick={decreasePlaybackSpeed}>
                <Remove style={{fontSize: '15px'}} className=' text-white/[0.7] font-light'  />
              </div>
              <div className='w-[20px] md:w-[20px] lg:w-[25px] h-[20px] md:h-[20px] lg:h-[25px] flex justify-center items-center rounded-[5px] ml-[10px] md:ml-[15px] lg:ml-[10px] cursor-pointer' onClick={skipBack}>
                <Replay10 style={{fontSize: '180%'}} className=' text-white/[0.7] font-light'  />
              </div>
              <div className='w-[20px] md:w-[20px] lg:w-[25px] h-[20px] md:h-[20px] lg:h-[25px] flex justify-center items-center rounded-[5px] ml-[10px] md:ml-[15px] lg:ml-[10px] cursor-pointer' onClick={skipForward}>
                <Forward30 style={{fontSize: '180%'}} className=' text-white/[0.7] font-light'  />
              </div>
              <div className='flex ml-[10px] md:ml-[15px] lg:ml-[20px] group justify-center items-center'>
                {state.mute
                  ? <VolumeOff style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '20px' }} />
                  : <VolumeUp style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '20px' }} />
                }
                <div className='flex opacity-0 justify-center items-center group-hover:opacity-100 transition-all'>
                  <Slider value={state.volume} onChange={onVolumeChange} size='small' style={{ width: '8vw', marginLeft: '10%', color: 'rgba(255, 255, 255, 1)', height: '15%' }} />
                </div>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <p className='text-white/[0.7] text-[10px] md:text-[12px] lg:text-[15px]' ref={durationRef}>{'00:00:00'} / {'00:00:00'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;