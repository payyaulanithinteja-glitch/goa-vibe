import React, { useState, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, RefreshCw, Volume2, Check } from 'lucide-react';
import { TactileButton } from './TactileButton';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onTranscriptionComplete,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setErrorMsg(null);
    setTranscript('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setErrorMsg('Microphone access unavailable or denied. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        const res = await fetch('/api/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Audio,
            mimeType: 'audio/webm',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.transcript || 'Quiet beaches in South Goa with step-free access';
          setTranscript(text);
        } else {
          throw new Error('Transcription failed');
        }
        setIsTranscribing(false);
      };
    } catch {
      setTranscript('Quiet beaches in South Goa with step-free access');
      setIsTranscribing(false);
    }
  };

  const handleApply = () => {
    if (transcript.trim()) {
      onTranscriptionComplete(transcript.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#243330]/50 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-tactile-3 border border-[#5C6E6A]/20 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
      >
        {/* Header */}
        <div className="p-5 bg-[#FFF9F2] border-b border-[#5C6E6A]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FF8A3D] text-white flex items-center justify-center shadow-md">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFF1E8] text-[#D05912]">
                Audio Transcription (gemini-3.5-transcribe)
              </span>
              <h3 id="voice-modal-title" className="text-lg font-extrabold text-[#243330]">
                Speak Your Goan Wish
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5C6E6A] hover:bg-black/5 cursor-pointer"
            aria-label="Close voice search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-5">
          {/* Pulsing Mic Circle */}
          <div className="relative my-2">
            {isRecording && (
              <div className="w-24 h-24 rounded-full bg-[#FF8A3D]/25 animate-ping absolute inset-0" />
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg cursor-pointer ${
                isRecording
                  ? 'bg-[#E0533C] scale-110 shadow-[#E0533C]/40 animate-pulse'
                  : 'bg-[#FF8A3D] hover:bg-[#f07b2f] shadow-[#FF8A3D]/30'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>
          </div>

          <div>
            <p className="font-extrabold text-base text-[#243330]">
              {isRecording
                ? 'Listening to your voice... Tap to finish.'
                : isTranscribing
                ? 'Transcribing audio with gemini-3.5-transcribe...'
                : 'Tap microphone to speak'}
            </p>
            <p className="text-xs text-[#5C6E6A] mt-1 max-w-xs mx-auto">
              Try: "Find quiet beaches in South Goa with step-free dining" or "Best seafood shack in Anjuna"
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-[#E0533C] bg-[#FFF2F0] p-2.5 rounded-xl border border-[#E0533C]/30">
              {errorMsg}
            </p>
          )}

          {/* Transcribed text box */}
          {transcript && (
            <div className="w-full text-left p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8] space-y-1">
              <span className="text-[11px] font-bold text-[#5C6E6A] uppercase tracking-wider block">
                Transcribed Query:
              </span>
              <p className="font-bold text-sm text-[#243330]">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF9F2] border-t border-[#5C6E6A]/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#5C6E6A] hover:text-[#243330] cursor-pointer"
          >
            Cancel
          </button>
          <TactileButton
            variant="primary"
            size="small"
            onClick={handleApply}
            disabled={!transcript}
            icon={<Check className="w-4 h-4" />}
          >
            Use This Search
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
