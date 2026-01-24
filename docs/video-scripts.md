# 🎬 MineAI IDE Video & GIF Scripts

This document contains detailed scripts for creating promotional videos and GIFs for the MineAI IDE GitHub page and marketing materials.

---

## 📹 Video 1: Introduction Video (60-90 seconds)

### Purpose
Hook new users, explain what MineAI IDE is, and show why they should use it.

### Script

**[0:00-0:05] - OPENING HOOK**
- Visual: Dark screen → MineAI logo animates in with glow effect
- Audio (TTS Coqui): "What if creating Minecraft mods was as easy as describing what you want?"

**[0:05-0:15] - PROBLEM STATEMENT**
- Visual: Split screen showing complex Java code on left, frustrated developer on right (stock footage or illustration)
- Audio: "Traditional modding requires learning Java, understanding complex APIs, and hours of debugging. But what if there was a better way?"

**[0:15-0:25] - SOLUTION REVEAL**
- Visual: MineAI IDE interface appears with smooth transition
- Audio: "Introducing MineAI IDE — the AI-powered Minecraft development environment that turns your ideas into reality."

**[0:25-0:40] - FEATURE SHOWCASE**
- Visual: Quick cuts showing:
  1. User typing "Create a ruby sword with 15 damage" → Code generates automatically
  2. Project wizard selecting Forge/Fabric/Spigot
  3. One-click build button → Mod JAR appears
  4. Minecraft running with the custom item
- Audio: "Simply describe what you want in plain English. MineAI generates the code, builds your mod, and you're ready to play."

**[0:40-0:55] - PLATFORM SUPPORT**
- Visual: Icons for Forge, Fabric, NeoForge, Spigot, Paper, Datapacks appearing
- Audio: "Whether you're creating Forge mods, Fabric mods, Spigot plugins, or datapacks — MineAI has you covered for Minecraft versions 1.12 through 1.21."

**[0:55-1:05] - CALL TO ACTION**
- Visual: Download button, GitHub stars counter, Discord invite
- Audio: "Download MineAI IDE free today. Join thousands of creators building the future of Minecraft."

**[1:05-1:15] - CLOSING**
- Visual: MineAI logo + tagline "Create. Play. Share."
- Audio: "MineAI IDE. Your ideas, realized."

### Production Notes
- **TTS Voice**: Use Coqui TTS with a friendly, enthusiastic male/female voice
- **Background Music**: Upbeat electronic/synth, Minecraft-inspired but modern
- **Subtitles**: Generate via Whisper after recording, embed as .srt
- **Resolution**: 1920x1080 (YouTube) / 1080x1080 (social)
- **Export**: MP4 H.264, also GIF versions for key moments

---

## 📹 Video 2: Tutorial - Creating Your First Mod (3-5 minutes)

### Purpose
Walk new users through creating a complete mod from start to finish.

### Script

**[0:00-0:15] - INTRO**
- Visual: MineAI IDE splash screen → Dashboard
- Audio: "Welcome to MineAI IDE! In this tutorial, we'll create a custom Minecraft sword from scratch in under 5 minutes."

**[0:15-0:45] - CREATING A NEW PROJECT**
- Visual: Click "New Project" → Project Wizard appears
- Steps to show:
  1. Select "Forge Mod"
  2. Enter mod name: "Ruby Tools"
  3. Select Minecraft version: 1.20.1
  4. Enter mod ID: rubytools
  5. Click "Create"
- Audio: "Click New Project, select Forge Mod, give it a name, and choose your Minecraft version. MineAI creates all the boilerplate code for you."

**[0:45-1:30] - USING AI TO CREATE CONTENT**
- Visual: AI chat panel opens, user types request
- User types: "Create a ruby sword item that deals 12 damage, has 1500 durability, and glows red when held"
- Show AI generating code in real-time
- Audio: "Now the magic happens. In the AI chat, describe what you want. Watch as MineAI generates the item class, model, texture placeholder, and recipe — all from one sentence."

**[1:30-2:15] - REVIEWING GENERATED CODE**
- Visual: Navigate file tree, open RubySword.java
- Highlight key parts of generated code
- Audio: "Let's look at what was generated. The AI created a proper item class extending SwordItem, set the damage and durability, and even added the glowing effect. Everything follows Forge best practices."

**[2:15-2:45] - BUILDING THE MOD**
- Visual: Click "Build" button → Terminal shows Gradle building → Success message
- Audio: "Ready to test? Click Build, and MineAI compiles your mod using Gradle. In about 30 seconds, your JAR file is ready."

**[2:45-3:30] - TESTING IN MINECRAFT**
- Visual: Click "Run Client" → Minecraft launches → Show item in creative inventory → Use the sword
- Audio: "Click Run Client to launch Minecraft with your mod. Open creative mode, find your Ruby Sword, and there it is! 12 damage, glowing red, exactly as requested."

**[3:30-4:00] - EXPORTING & SHARING**
- Visual: Show export dialog, JAR file location
- Audio: "Your mod JAR is in the build/libs folder, ready to share on CurseForge, Modrinth, or with friends."

**[4:00-4:30] - OUTRO**
- Visual: Final mod showcase, MineAI logo
- Audio: "That's it! You just created a Minecraft mod without writing a single line of code. Imagine what else you can create. Download MineAI IDE and start building today!"

### Production Notes
- **Screen Recording**: OBS at 1080p60
- **Mouse Highlights**: Use mouse spotlight effect
- **Zoom**: Zoom into important UI elements
- **Chapters**: Add YouTube chapters for each section

---

## 🎞️ GIF 1: Dashboard Overview (5-8 seconds, looping)

### Purpose
Show the main interface at a glance.

### Storyboard
1. Frame 1-10: Dashboard loads with recent projects
2. Frame 11-20: Mouse hovers over "New Project" button (button glows)
3. Frame 21-30: Scroll down showing features
4. Frame 31-40: Return to top (seamless loop)

### Recording Instructions
```
1. Open MineAI IDE
2. Ensure 2-3 recent projects are visible
3. Start recording (LICEcap or ScreenToGif)
4. Hover over New Project, then scroll down slowly
5. Stop recording, trim to loop smoothly
6. Export: 800x450, 15fps, max 5MB
```

### Filename
`public/assets/screenshot-dashboard.gif`

---

## 🎞️ GIF 2: AI Code Generation (8-10 seconds, looping)

### Purpose
Show the "magic moment" of describing something and getting code.

### Storyboard
1. Frame 1-20: Empty AI chat, cursor blinking
2. Frame 21-60: User types "Create a teleport wand that teleports player 10 blocks forward"
3. Frame 61-100: AI responds with code appearing line by line
4. Frame 101-120: Code panel shows generated file
5. Frame 121-140: Pause on completed generation, then fade/loop

### Recording Instructions
```
1. Open MineAI IDE with a project loaded
2. Open AI chat panel
3. Start recording
4. Type the prompt naturally (not too fast)
5. Wait for AI to generate code
6. Pause 2 seconds on result
7. Export: 800x450, 12fps, max 8MB
```

### Filename
`public/assets/screenshot-ai-generation.gif`

---

## 🎞️ GIF 3: Project Wizard (6-8 seconds, looping)

### Purpose
Show how easy it is to start a new project.

### Storyboard
1. Frame 1-15: Click "New Project"
2. Frame 16-40: Wizard opens, select project type (click Forge)
3. Frame 41-65: Enter project name, select version
4. Frame 66-85: Click "Create", loading spinner
5. Frame 86-100: Project created, file tree populates

### Recording Instructions
```
1. Start at dashboard
2. Click New Project
3. Fill wizard fields with example data
4. Create the project
5. Capture until file tree is visible
6. Export: 800x450, 12fps, max 6MB
```

### Filename
`public/assets/screenshot-wizard.gif`

---

## 🎞️ GIF 4: One-Click Build (5-6 seconds)

### Purpose
Show the build process is simple.

### Storyboard
1. Frame 1-10: Mouse clicks "Build" button
2. Frame 11-50: Terminal shows Gradle output scrolling
3. Frame 51-70: "BUILD SUCCESSFUL" message appears
4. Frame 71-90: Output folder shows JAR file

### Filename
`public/assets/screenshot-build.gif`

---

## 🎞️ GIF 5: Mod Running in Minecraft (8-10 seconds)

### Purpose
Show the end result works in-game.

### Storyboard
1. Frame 1-20: Click "Run Client" in MineAI
2. Frame 21-60: Minecraft loading screen
3. Frame 61-100: In-game, open creative inventory
4. Frame 101-130: Find custom item, equip it
5. Frame 131-160: Use the item (attack, special ability)

### Filename
`public/assets/screenshot-ingame.gif`

---

## 🛠️ Recording Tools Recommended

| Tool | Purpose | Platform |
|------|---------|----------|
| **OBS Studio** | Screen recording | Windows/Mac/Linux |
| **ScreenToGif** | GIF capture | Windows |
| **LICEcap** | Simple GIF capture | Windows/Mac |
| **Gifski** | High-quality GIF encoding | Windows/Mac/Linux |
| **FFmpeg** | Video processing | All |
| **DaVinci Resolve** | Video editing (free) | All |

---

## 🎤 Audio Production (Coqui TTS + Whisper)

### Generating Voiceover with Coqui TTS

```bash
# Install Coqui TTS
pip install TTS

# Generate voiceover
tts --text "What if creating Minecraft mods was as easy as describing what you want?" \
    --model_name "tts_models/en/ljspeech/tacotron2-DDC" \
    --out_path intro_hook.wav

# For more natural voice, use XTTS v2
tts --text "Your script here" \
    --model_name "tts_models/multilingual/multi-dataset/xtts_v2" \
    --speaker_wav reference_voice.wav \
    --language_idx en \
    --out_path output.wav
```

### Generating Subtitles with Whisper

```bash
# Install Whisper
pip install openai-whisper

# Transcribe and generate subtitles
whisper final_video.mp4 --model medium --output_format srt

# For better accuracy
whisper final_video.mp4 --model large-v2 --language en --output_format srt
```

### Subtitle Styling
```srt
1
00:00:00,000 --> 00:00:05,000
What if creating Minecraft mods
was as easy as describing what you want?

2
00:00:05,000 --> 00:00:15,000
Traditional modding requires learning Java,
understanding complex APIs...
```

---

## 📁 Asset Checklist

After recording, you should have:

```
public/assets/
├── banner.svg                    ✓ (created)
├── screenshot-dashboard.gif      □ TODO: Record
├── screenshot-wizard.gif         □ TODO: Record
├── screenshot-ai-generation.gif  □ TODO: Record
├── screenshot-build.gif          □ TODO: Record
├── screenshot-ingame.gif         □ TODO: Record
├── intro-video.mp4               □ TODO: Record
├── tutorial-first-mod.mp4        □ TODO: Record
└── subtitles/
    ├── intro-video.srt           □ TODO: Generate
    └── tutorial-first-mod.srt    □ TODO: Generate
```

---

## 📤 Publishing Checklist

- [ ] Upload intro video to YouTube
- [ ] Upload tutorial to YouTube
- [ ] Embed YouTube links in README
- [ ] Upload GIFs to GitHub repo
- [ ] Update README with GIF references
- [ ] Create Twitter/X teaser clips (15sec)
- [ ] Create Discord announcement
