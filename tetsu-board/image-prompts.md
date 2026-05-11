# Image Generation Prompts for tetsu-board note article

For Gemini Imagen and other AI image generators.
Use case: header image for the article "鉄道テーマの教育ボードゲームを Claude と一緒に7フェーズで設計してみた"

---

## ★ Recommended: Main Prompt (Concept 1 - Board Game Overview)

### Why this is recommended

- Directly visualizes the article topic (the board game itself)
- Pixel art style matches the confirmed design direction (Kairosoft-inspired)
- Includes 4 seasonal characters from the game design (Haru/Natsu/Aki/Fuyu)
- 5 station types naturally show educational content (industry structure)
- Isometric view stands out in social media feeds
- Original composition, no Momotetsu IP concerns

### Recommended Prompt (English)

```
A top-down isometric pixel art view of an educational board game,
in the style of Kairosoft games like "Game Dev Story" and "Hot Springs Story".
A circular train route winds through five types of distinctive stations:
a farm station with green fields and crops, a factory station with smokestacks,
a shopping district station with colorful storefronts, a hotel station with
a tall building, and a seaport station with boats and waves.
The stations are connected by railroad tracks forming a closed loop.
On the tracks are four cute pixel art character pieces representing the four
seasons: spring (pink with cherry blossom motif), summer (bright blue with
sun motif), autumn (warm orange with maple leaf motif), and winter (soft
white with snowflake motif). Warm pastel color palette throughout.
Soft blue sky with fluffy clouds in the background. 16-bit retro dot-art
style, high pixel detail with clean composition. Friendly, educational,
inviting atmosphere. Suitable for an educational technology blog header.
Aspect ratio 16:9, resolution 1280x670.

No text, no letters, no words anywhere in the image.
No realistic photographic elements.
No characters resembling Momotaro Dentetsu (Momotetsu) franchise.
```

### Variations (Atmosphere Modifiers)

Append one of these to the Recommended Prompt:

#### A) Warmer atmosphere

```
Style modifier: golden hour lighting, soft warm tones,
nostalgic feeling, cozy atmosphere, gentle sunset colors.
```

#### B) Vibrant energy

```
Style modifier: bright vivid colors, saturated palette,
playful energy, daytime brightness, cheerful mood.
```

#### C) Calm educational tone

```
Style modifier: clean minimalist composition, soft pastel tones,
calm and focused atmosphere, suitable for school environment,
inclusive and welcoming feel.
```

---

## Alternative Concept 2: Seven-Phase Design Process

### Use case

When you want to emphasize the structured design process rather than the game itself.

### Prompt (English)

```
A pixel art illustration depicting seven design phases as small connected
islands, in retro 16-bit dot-art style. Each island has a symbolic icon:
1) Game design island - blueprint and dice
2) Map island - railroad tracks and stations
3) Economy island - coins and small buildings
4) Character island - cute pixel art characters
5) Quiz island - question marks and books
6) Technology island - pixel art computer monitor
7) Blueprint island - architectural drawings and pencil
The islands are connected by railroad tracks flowing left to right or
top to bottom, suggesting a sequential workflow. Soft pastel gradient
background in light blue or lavender. Warm and creative atmosphere.
Aspect ratio 16:9.

No text, no letters, no words in the image.
No realistic photographic elements.
```

---

## Alternative Concept 3: Inclusive Classroom Scene

### Use case

When you want to emphasize the educational use case and inclusive design.

### Prompt (English)

```
A warm pixel art classroom scene in retro 16-bit dot-art style.
A large screen or TV at the center displays a circular train-themed
educational board game. Three to four diverse pixel art students
(including students using wheelchairs or assistive devices) gather
around the screen, taking turns to play. Four seasonal pixel art
characters are visible on the game screen. A teacher figure stands
quietly in the background, observing supportively. Soft natural light
filters through windows. Warm color palette evoking comfort and safety.
Inclusive, welcoming, and supportive educational atmosphere.
Aspect ratio 16:9.

No text, no letters, no words in the image.
No realistic photographic elements.
No characters resembling Momotaro Dentetsu franchise.
```

---

## Alternative Concept 4: Human × AI Collaboration

### Use case

When you want to emphasize the AI partnership angle.

### Prompt (English)

```
A pixel art illustration in retro 16-bit dot-art style depicting
"human and AI collaboratively designing an educational game".
At the center floats a holographic prototype of a circular train-themed
board game with stations and pixel art characters. On the left side,
a human designer in silhouette (pixel art style) reaches toward the
prototype, placing design elements. On the right side, a glowing AI
character (pixel art with blue and purple gradient) reaches toward the
prototype, suggesting design elements. Soft light flows between them.
Background uses pale lavender and soft blue gradients.
Theme of collaboration and creativity. Warm pastel colors.
Aspect ratio 16:9.

No text, no letters, no words in the image.
No realistic photographic elements.
```

---

## Negative Prompt (Common, to be appended to all)

```
Avoid:
- Text, letters, words, captions, watermarks
- Photorealistic or 3D rendered elements
- Dark, gloomy, or threatening atmosphere
- Characters resembling Momotaro Dentetsu (Momotetsu) franchise
- Specific real-world identifiable persons
- Overly complex or cluttered details
- Low-quality or blurry pixel art
- Stereotypical or insensitive representation of disabilities
```

---

## Production Tips

### Generation workflow

1. Access Gemini → select Imagen feature (or use ImageFX, Whisk, etc.)
2. Paste the Recommended Prompt
3. Generate 4-8 candidates
4. Select preferred output
5. If atmosphere is off, append one of the A/B/C modifiers and regenerate
6. If concept doesn't fit, try Alternative Concepts 2/3/4

### Post-production

- Article header recommended size: 1280×670 (note compatible)
- Add the title text "鉄道テーマの教育ボードゲームを Claude と一緒に7フェーズで設計してみた" as overlay using:
  - Canva (easy, browser-based)
  - Figma (designer-friendly)
  - Photoshop (full control)
  - Pixelmator / Affinity Photo (Mac alternatives)
- Use bold gothic typeface for visibility and educational tone

### Style consistency

When generating multiple images for the same project:
- Always include `pixel art`, `16-bit`, `Kairosoft style` consistently
- Use the same color palette descriptor (`warm pastel` recommended)
- Keep the aspect ratio consistent (16:9 for headers, 1:1 for thumbnails)

### Common pitfalls

- **Text rendering**: AI image generators struggle with text. Always use "no text" in negative prompt and add text in post-production.
- **Style drift**: If multiple generations look inconsistent, anchor with specific style references like "Kairosoft Game Dev Story art style".
- **Over-detailing**: Pixel art benefits from clean composition; avoid prompts that over-specify details.
- **Character likeness**: To avoid IP issues, always exclude Momotetsu-specific elements explicitly.

---

## Reuse Notes

This prompt library can be reused for:
- note article headers
- Twitter/X social media images
- Presentation slides
- Marketing materials for教育機関 outreach (with C variation)
- Documentation cover images

---

## Update Log

| Date | Change |
|---|---|
| 2026-05-08 | Initial prompt library created based on tetsu-board project Phase 1-7 design |
