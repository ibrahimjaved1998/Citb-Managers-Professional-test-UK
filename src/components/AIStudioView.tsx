import React, { useState } from 'react';
import { ASSETS } from '../data/mockData.ts';

type AIToolTab = 'text-to-video' | 'image-to-video' | 'create-image' | 'edit-image';

export const AIStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AIToolTab>('image-to-video');

  // Video Generation States
  const [videoPrompt, setVideoPrompt] = useState(
    'A cinematic drone camera pan across an excavation trench with yellow shoring boxes and civil engineers in high-visibility gear'
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoResolution, setVideoResolution] = useState<'720p' | '1080p'>('720p');
  const [uploadedImageForVideo, setUploadedImageForVideo] = useState<string | null>(ASSETS.activeExamTrench);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoProgressMsg, setVideoProgressMsg] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Image Generation / Editing States
  const [imagePrompt, setImagePrompt] = useState(
    'A realistic UK construction site with clear CAT underground cable avoidance scanning in progress, warning signs, and trench shoring'
  );
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');
  const [uploadedImageForEdit, setUploadedImageForEdit] = useState<string | null>(ASSETS.videoModule16);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'video' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'video') {
        setUploadedImageForVideo(result);
      } else {
        setUploadedImageForEdit(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger Video Generation (Veo 3: veo-3.1-fast-generate-preview)
  const handleGenerateVideo = async (withImage: boolean) => {
    setIsVideoGenerating(true);
    setVideoError(null);
    setGeneratedVideoUrl(null);
    setVideoProgressMsg('Initializing Veo 3 video engine (veo-3.1-fast-generate-preview)...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageBase64: withImage ? uploadedImageForVideo : undefined,
          aspectRatio: videoAspectRatio,
          resolution: videoResolution,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to start video generation');
      }

      const operationName = data.operationName;
      setVideoProgressMsg('Video rendering queued. Polling operation progress...');

      // Polling loop
      let done = false;
      let attempts = 0;
      while (!done && attempts < 60) {
        await new Promise((r) => setTimeout(r, 6000));
        attempts++;

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        const statusData = await statusRes.json();

        if (statusData.error) {
          throw new Error(statusData.error.message || 'Error during video generation');
        }

        if (statusData.done) {
          done = true;
          setVideoProgressMsg('Generation complete! Downloading video stream...');

          const dlRes = await fetch('/api/video-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName }),
          });

          if (!dlRes.ok) {
            throw new Error('Failed to download video stream');
          }

          const blob = await dlRes.blob();
          const videoUrl = URL.createObjectURL(blob);
          setGeneratedVideoUrl(videoUrl);
          break;
        } else {
          setVideoProgressMsg(
            `Generating frames with Veo 3 (${attempts * 6}s elapsed)...`
          );
        }
      }

      if (!done) {
        throw new Error('Video generation timed out. Please check your network and try again.');
      }
    } catch (err: any) {
      console.error(err);
      setVideoError(err.message || 'An unexpected error occurred during video generation.');
    } finally {
      setIsVideoGenerating(false);
    }
  };

  // Trigger Image Generation / Editing (gemini-nano-banana-2.1)
  const handleGenerateImage = async (isEdit: boolean) => {
    setIsImageGenerating(true);
    setImageError(null);
    setGeneratedImageUrl(null);

    try {
      const endpoint = isEdit ? '/api/edit-image' : '/api/generate-image';
      const bodyPayload = isEdit
        ? {
            prompt: imagePrompt,
            imageBase64: uploadedImageForEdit,
            aspectRatio: imageAspectRatio,
            imageSize,
          }
        : {
            prompt: imagePrompt,
            aspectRatio: imageAspectRatio,
            imageSize,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        throw new Error('Model did not return an image part.');
      }
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || 'An error occurred while creating image with gemini-nano-banana-2.1.');
    } finally {
      setIsImageGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-4 gap-4 pb-28">
      {/* Top Banner */}
      <section className="bg-primary-container text-white p-4 rounded-xl shadow-md border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider">
            AI STUDIO MEDIA ENGINE
          </span>
          <span className="text-xs text-secondary-fixed-dim font-bold">
            Veo 3 &amp; Gemini Nano Banana 2.1
          </span>
        </div>
        <h2 className="text-xl font-bold font-headline mt-0.5">
          CITB Construction Media Studio
        </h2>
        <p className="text-xs text-surface-container-highest mt-1 leading-relaxed">
          Generate realistic video revision clips from text or animate real site photos with Veo 3,
          and generate or edit high-precision site hazard diagrams with Gemini Nano Banana 2.1.
        </p>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('image-to-video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'image-to-video'
                ? 'bg-secondary-container text-on-secondary-fixed shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">movie</span>
            <span>Animate Photo into Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text-to-video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'text-to-video'
                ? 'bg-secondary-container text-on-secondary-fixed shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">video_spark</span>
            <span>Generate Video from Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create-image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'create-image'
                ? 'bg-secondary-container text-on-secondary-fixed shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>Create Image</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit-image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'edit-image'
                ? 'bg-secondary-container text-on-secondary-fixed shadow-xs'
                : 'bg-white/10 text-white/80 hover:bg-white/15'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">image_edit_auto</span>
            <span>Edit Image</span>
          </button>
        </div>
      </section>

      {/* --- TAB 1: ANIMATE IMAGE INTO VIDEO (Veo 3) --- */}
      {activeTab === 'image-to-video' && (
        <section className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div>
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Animate Photo into Video with Veo 3
              </h3>
              <p className="text-xs text-on-surface-variant">
                Upload a site photo or excavation diagram, and Veo will generate cinematic motion.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-secondary">
              veo-3.1-fast-generate-preview
            </span>
          </div>

          {/* Photo Preview & Upload Input */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-on-surface">Starting Photo:</span>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/5 border border-surface-container flex items-center justify-center">
              {uploadedImageForVideo ? (
                <img
                  src={uploadedImageForVideo}
                  alt="Source for animation"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-outline">No photo selected</span>
              )}
              <label className="absolute bottom-2 right-2 bg-primary-container hover:bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'video')}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Prompt */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="video-anim-prompt" className="text-xs font-bold text-on-surface">
              Animation Direction Prompt:
            </label>
            <textarea
              id="video-anim-prompt"
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-lg border border-surface-container bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
              placeholder="e.g. Animate camera pushing into the trench with dust rising..."
            />
          </div>

          {/* Aspect Ratio and Resolution */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs font-bold text-on-surface block mb-1">
                Aspect Ratio:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('16:9')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    videoAspectRatio === '16:9'
                      ? 'bg-secondary-container text-on-secondary-fixed border-secondary-container'
                      : 'bg-surface-container text-on-surface border-surface-container-high'
                  }`}
                >
                  16:9 (Landscape)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('9:16')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    videoAspectRatio === '9:16'
                      ? 'bg-secondary-container text-on-secondary-fixed border-secondary-container'
                      : 'bg-surface-container text-on-surface border-surface-container-high'
                  }`}
                >
                  9:16 (Portrait)
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-on-surface block mb-1">
                Resolution:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVideoResolution('720p')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    videoResolution === '720p'
                      ? 'bg-primary-container text-white border-primary-container'
                      : 'bg-surface-container text-on-surface border-surface-container-high'
                  }`}
                >
                  720p
                </button>
                <button
                  type="button"
                  onClick={() => setVideoResolution('1080p')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    videoResolution === '1080p'
                      ? 'bg-primary-container text-white border-primary-container'
                      : 'bg-surface-container text-on-surface border-surface-container-high'
                  }`}
                >
                  1080p
                </button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={isVideoGenerating}
            onClick={() => handleGenerateVideo(true)}
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim disabled:opacity-50 text-on-secondary-fixed font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer font-headline"
          >
            {isVideoGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>{videoProgressMsg || 'Generating with Veo 3...'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                <span>Animate Photo with Veo 3</span>
              </>
            )}
          </button>

          {videoError && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs border border-error/30 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{videoError}</span>
            </div>
          )}

          {/* Generated Video Output */}
          {generatedVideoUrl && (
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              <span className="text-xs font-bold text-on-surface">Generated Video:</span>
              <div className="rounded-xl overflow-hidden shadow-md bg-black">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <a
                href={generatedVideoUrl}
                download="veo3-animated-scene.mp4"
                className="self-end text-xs font-bold text-secondary flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download MP4</span>
              </a>
            </div>
          )}
        </section>
      )}

      {/* --- TAB 2: GENERATE VIDEO FROM TEXT (Veo 3) --- */}
      {activeTab === 'text-to-video' && (
        <section className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div>
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Generate Video from Text with Veo 3
              </h3>
              <p className="text-xs text-on-surface-variant">
                Synthesize high-fidelity construction and safety video sequences directly from text prompts.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-secondary">
              veo-3.1-fast-generate-preview
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="video-text-prompt" className="text-xs font-bold text-on-surface">
              Scene Prompt:
            </label>
            <textarea
              id="video-text-prompt"
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-surface-container bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
              placeholder="e.g. Tower crane lifting precast concrete beam in overcast London weather..."
            />
          </div>

          {/* Preset Prompts */}
          <div className="flex gap-2 flex-wrap">
            {[
              'Hydraulic trench box installation inside excavation',
              'CAT scanner worker tracing unmapped gas line',
              'Site supervisor performing weekly LOLER crane check',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setVideoPrompt(preset)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Aspect Ratio */}
          <div>
            <span className="text-xs font-bold text-on-surface block mb-1">
              Aspect Ratio:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVideoAspectRatio('16:9')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  videoAspectRatio === '16:9'
                    ? 'bg-secondary-container text-on-secondary-fixed border-secondary-container'
                    : 'bg-surface-container text-on-surface border-surface-container-high'
                }`}
              >
                16:9 (Landscape)
              </button>
              <button
                type="button"
                onClick={() => setVideoAspectRatio('9:16')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  videoAspectRatio === '9:16'
                    ? 'bg-secondary-container text-on-secondary-fixed border-secondary-container'
                    : 'bg-surface-container text-on-surface border-surface-container-high'
                }`}
              >
                9:16 (Portrait)
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={isVideoGenerating}
            onClick={() => handleGenerateVideo(false)}
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim disabled:opacity-50 text-on-secondary-fixed font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer font-headline"
          >
            {isVideoGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>{videoProgressMsg || 'Generating with Veo 3...'}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">video_spark</span>
                <span>Generate Video from Prompt</span>
              </>
            )}
          </button>

          {videoError && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs border border-error/30 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{videoError}</span>
            </div>
          )}

          {generatedVideoUrl && (
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              <span className="text-xs font-bold text-on-surface">Generated Video:</span>
              <div className="rounded-xl overflow-hidden shadow-md bg-black">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* --- TAB 3: CREATE IMAGE (gemini-nano-banana-2.1) --- */}
      {activeTab === 'create-image' && (
        <section className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div>
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Create Image with Gemini Nano Banana 2.1
              </h3>
              <p className="text-xs text-on-surface-variant">
                Generate high-resolution safety schematics, site hazard photos, or PPE checklists.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-secondary">
              gemini-nano-banana-2.1
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="img-create-prompt" className="text-xs font-bold text-on-surface">
              Image Prompt:
            </label>
            <textarea
              id="img-create-prompt"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-surface-container bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
              placeholder="e.g. Deep trench with hydraulic shoring and emergency rescue tripod..."
            />
          </div>

          {/* Aspect Ratio & Resolution */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs font-bold text-on-surface block mb-1">
                Aspect Ratio:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['1:1', '16:9', '9:16', '4:3'] as const).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setImageAspectRatio(ar)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      imageAspectRatio === ar
                        ? 'bg-secondary-container text-on-secondary-fixed border-secondary-container'
                        : 'bg-surface-container text-on-surface border-surface-container-high'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-on-surface block mb-1">
                Resolution:
              </span>
              <div className="flex gap-2">
                {(['1K', '2K'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      imageSize === sz
                        ? 'bg-primary-container text-white border-primary-container'
                        : 'bg-surface-container text-on-surface border-surface-container-high'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isImageGenerating}
            onClick={() => handleGenerateImage(false)}
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim disabled:opacity-50 text-on-secondary-fixed font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer font-headline"
          >
            {isImageGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>Generating with Nano Banana 2.1...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                <span>Generate Image with Nano Banana 2.1</span>
              </>
            )}
          </button>

          {imageError && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs border border-error/30 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{imageError}</span>
            </div>
          )}

          {generatedImageUrl && (
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              <span className="text-xs font-bold text-on-surface">Generated Image Result:</span>
              <div className="rounded-xl overflow-hidden shadow-md border border-surface-container bg-black">
                <img
                  src={generatedImageUrl}
                  alt="Generated with gemini-nano-banana-2.1"
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
              </div>
              <a
                href={generatedImageUrl}
                download="nano-banana-image.png"
                className="self-end text-xs font-bold text-secondary flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download PNG</span>
              </a>
            </div>
          )}
        </section>
      )}

      {/* --- TAB 4: EDIT IMAGE (gemini-nano-banana-2.1) --- */}
      {activeTab === 'edit-image' && (
        <section className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div>
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Edit Image with Gemini Nano Banana 2.1
              </h3>
              <p className="text-xs text-on-surface-variant">
                Upload or select an existing photo, and describe the modifications or hazard overlays to apply.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-secondary">
              gemini-nano-banana-2.1
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-on-surface">Source Image to Edit:</span>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/5 border border-surface-container flex items-center justify-center">
              {uploadedImageForEdit ? (
                <img
                  src={uploadedImageForEdit}
                  alt="Image to edit"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-outline">No image selected</span>
              )}
              <label className="absolute bottom-2 right-2 bg-primary-container hover:bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>Upload New Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="img-edit-prompt" className="text-xs font-bold text-on-surface">
              Edit Instructions:
            </label>
            <textarea
              id="img-edit-prompt"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-lg border border-surface-container bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
              placeholder="e.g. Add red warning perimeter barrier tape and safety signage around the excavation..."
            />
          </div>

          <button
            type="button"
            disabled={isImageGenerating}
            onClick={() => handleGenerateImage(true)}
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim disabled:opacity-50 text-on-secondary-fixed font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer font-headline"
          >
            {isImageGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>Editing with Nano Banana 2.1...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">image_edit_auto</span>
                <span>Apply Edits with Nano Banana 2.1</span>
              </>
            )}
          </button>

          {imageError && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs border border-error/30 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{imageError}</span>
            </div>
          )}

          {generatedImageUrl && (
            <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
              <span className="text-xs font-bold text-on-surface">Edited Image Result:</span>
              <div className="rounded-xl overflow-hidden shadow-md border border-surface-container bg-black">
                <img
                  src={generatedImageUrl}
                  alt="Edited with gemini-nano-banana-2.1"
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
