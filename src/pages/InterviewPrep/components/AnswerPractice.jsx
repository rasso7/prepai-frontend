import React, { useState, useRef } from 'react';
import { LuMic, LuMicOff, LuSend, LuPlay, LuRefreshCw } from 'react-icons/lu';
import SpinnerLoader from '../../../components/Loader/SpinnerLoader';

const AnswerPractice = ({ question, onSubmitAnswer, isLoading = false }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'voice'
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
        
        // Convert speech to text (you'll need to implement this)
        convertSpeechToText(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Convert speech to text (placeholder - you'll need to implement actual speech-to-text)
  const convertSpeechToText = async (audioBlob) => {
    try {
      // This is a placeholder. You can use:
      // 1. Web Speech API (browser-based)
      // 2. Send audio to your backend for processing with services like:
      //    - Google Speech-to-Text
      //    - OpenAI Whisper
      //    - Azure Speech Services
      
      // For now, we'll use Web Speech API if available
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setUserAnswer(transcript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };
        
        // Note: This won't work with recorded blob directly
        // You'll need to implement server-side speech-to-text
        
      } else {
        // Fallback: Send to your backend API
        const formData = new FormData();
        formData.append('audio', audioBlob);
        
        // Example API call (implement this in your backend)
        // const response = await axiosInstance.post('/api/speech-to-text', formData);
        // setUserAnswer(response.data.transcript);
        
        setUserAnswer('Voice transcription not available. Please type your answer.');
      }
    } catch (error) {
      console.error('Error converting speech to text:', error);
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (recordedBlob) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Stop playing audio
  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Clear recording and text
  const clearAnswer = () => {
    setUserAnswer('');
    setRecordedBlob(null);
    setRecordingTime(0);
    stopPlaying();
  };

  // Submit answer for AI evaluation
  const handleSubmit = () => {
    if (userAnswer.trim()) {
      onSubmitAnswer({
        question: question,
        userAnswer: userAnswer.trim(),
        inputMode: inputMode,
        recordingDuration: recordingTime
      });
    }
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Practice Your Answer</h3>
        <p className="text-gray-600 text-sm mb-4">{question}</p>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputMode === 'text' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Type Answer
          </button>
          <button
            onClick={() => setInputMode('voice')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputMode === 'voice' 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Voice Answer
          </button>
        </div>
      </div>

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="mb-4">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Voice Input Mode */}
      {inputMode === 'voice' && (
        <div className="mb-4">
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Voice Recording</span>
              {recordingTime > 0 && (
                <span className="text-sm text-gray-500">{formatTime(recordingTime)}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  disabled={isLoading}
                >
                  <LuMic className="text-lg" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <LuMicOff className="text-lg" />
                  Stop Recording
                </button>
              )}

              {recordedBlob && (
                <>
                  {!isPlaying ? (
                    <button
                      onClick={playRecording}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <LuPlay className="text-lg" />
                      Play
                    </button>
                  ) : (
                    <button
                      onClick={stopPlaying}
                      className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <LuPlay className="text-lg" />
                      Stop
                    </button>
                  )}
                </>
              )}

              {(userAnswer || recordedBlob) && (
                <button
                  onClick={clearAnswer}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  <LuRefreshCw className="text-lg" />
                  Clear
                </button>
              )}
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording...</span>
              </div>
            )}

            {/* Transcribed text */}
            {userAnswer && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <p className="text-sm text-gray-600 mb-1">Transcribed Text:</p>
                <p className="text-gray-800">{userAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim() || isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <SpinnerLoader />
          ) : (
            <LuSend className="text-lg" />
          )}
          Get AI Feedback
        </button>
      </div>
    </div>
  );
};

export default AnswerPractice;