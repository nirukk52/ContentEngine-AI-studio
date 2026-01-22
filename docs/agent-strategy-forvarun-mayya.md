1) Agent policies for “Varun Mayya style” consistency
A. Narrative rules (non-negotiable)

Hook in 1 line: “Here’s what just happened + why it matters.”

Proof-first: every claim must map to a visible proof moment (tweet / doc / chart / screen recording).

One core thesis: no branching; everything supports the thesis.

Short sentences. No filler. No “let’s dive in”.

Pace = compressed: new info every ~2–3 seconds (visual or verbal).

B. Script formatting rules (so the editor can render it)

Script must be scene-based: scene_id, voiceover, on_screen, proof_asset_id.

Each scene has one intent: explain OR show proof OR summarize.

Words to emphasize must be tagged (for kinetic typography + caption pops).

C. Editing rules (signature feel)

Always show evidence transitions: claim → proof zoom → highlight → back to claim.

Use mini-lists only for “3 things / 2 reasons / 1 takeaway”.

Picture-in-picture only when it adds credibility (reading a doc/tweet live).

Captions are not subtitles; they’re designed typography (rhythm + emphasis).

D. Trust rules

If proof is weak: downgrade language (“likely”, “suggests”) or remove the claim.

Generated B-roll must never look like proof. Keep it clearly “illustrative”.

2) Exact MCP list + how tools are callable in your agent runtime
How MCP tools are exposed (your runtime contract)

Each capability is an MCP tool with a name + JSON schema, invokable by the model.

Don’t dump 60 tools into context. Load tools per stage (keeps agents sharp + cheaper).

Recommended MCP servers (clean separation)

(1) Ingest MCP

ingest.upload_mp4

ingest.get_video_manifest (duration, fps, audio track, hash)

ingest.extract_audio

(2) Understand MCP

understand.transcribe_whisper

understand.scene_detect

understand.ocr_frames

understand.key_moments (candidate highlights)

(3) Proof MCP

proof.import_tweet_screenshot

proof.import_doc_screenshot

proof.highlight_regions (boxes to animate)

(4) Script MCP

script.generate_beats (Hook/Context/Insight/Impact/Close)

script.write_scene_script

script.tighten_for_60s

(5) Voice MCP

voice.tts_elevenlabs (text → audio)

voice.voice_style (pace, intensity)

ElevenLabs credit logic is character-based (1 char ≈ 1 credit on standard models).

(6) Avatar MCP (optional)

avatar.create_talking_head (audio + avatar id → mp4)

HeyGen API pricing is credit-based (tier-dependent).

(7) Pixel/B-roll MCP (optional)

broll.generate_runway_clip

broll.generate_transition_bg

Runway API credits are purchasable (docs show $0.01/credit).
Runway “Free” example also clarifies credits → seconds of video.

(8) Edit Plan MCP (core)

editplan.build_timeline_json (scenes, overlays, captions, emphasis tags)

editplan.apply_style_pack (fonts, caption rules, transitions)

(9) Render MCP (Remotion)

render.preview_lowres (10–15s)

render.final_1080x1920

render.get_render_status

Remotion guidance: trigger Remotion Lambda renders from Vercel functions (don’t render inside Vercel).
Also: renderer isn’t deployable directly to Vercel due to headless browser size constraints.

(10) Publish MCP

publish.export_youtube_shorts

publish.export_instagram_reels

publish.generate_caption_copy