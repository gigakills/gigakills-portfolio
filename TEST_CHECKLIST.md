# Quick Test Checklist — Before 3D Integration

**Time Estimate**: 5–10 minutes  
**What to Check**: Core functionality, responsive layout, background layer isolation  
**Goal**: Verify site is stable before adding Three.js

---

## BROWSER SETUP

1. Open: `file://c:\Users\Austin\Documents\PortfolioV2\index.html`
   - Or: Run `python -m http.server 8000` in the folder, then `http://localhost:8000`
2. Open DevTools (F12) → Console tab
3. **Check**: No red errors

---

## TEST 1: Basic Page Load

- [ ] Page loads (no blank screen)
- [ ] Hero section visible
- [ ] "GIGAKILLS" title centered
- [ ] "Ushering in the golden age..." tagline visible
- [ ] Four CTA buttons visible

**If broken**: Check console for errors, refresh

---

## TEST 2: Mode Switching

1. Look at left side: **"SELECT REALITY MODE"** dock
   - [ ] "Graveyard Realm" button visible
   - [ ] "Matrix Sector" button visible

2. **Press B key** (or click "⚡ Breach Reality" button)
   - [ ] Screen flashes/glitches (breach animation plays)
   - [ ] Background changes color
   - [ ] Text color changes (bone/blood → green/cyan)

3. **Press B again**
   - [ ] Switches back to original mode
   - [ ] Animation plays again

**Expected Colors:**
- **Graveyard**: Dark brown/black background, pale bone text, blood-red accents
- **Matrix**: Dark teal/green background, bright green/cyan text

---

## TEST 3: Visual Overlays

**In Graveyard Mode:**
- [ ] Vignette visible (dark edges around screen)
- [ ] Embers drifting upward in background
- [ ] Fog rolling in background
- [ ] No scanlines (scanlines only in matrix)

**Switch to Matrix Mode (press B):**
- [ ] Scanlines visible (horizontal lines across screen)
- [ ] Code rain animating on left side (falling characters)
- [ ] Earth visible in center of background (rotating)
- [ ] Green grid on right side of background

---

## TEST 4: Navigation (Desktop)

**At 1920px width:**
- [ ] Top nav visible with "GIGAKILLS" logo
- [ ] "NODE // GV-REALM" eyebrow visible (right of logo)
- [ ] Nav links visible: "01 Home 02 Projects 03 About..." (numbered)
- [ ] Sound button visible (dot + "Sound" text)
- [ ] Breach button visible (⌘ symbol)
- [ ] Menu icon visible (three lines)

**Click the menu icon:**
- [ ] Nothing special happens yet (placeholder)

---

## TEST 5: Responsive Layout (Narrow Desktop)

**Resize to 1100px width:**
- [ ] Nav eyebrow disappears
- [ ] Logo + nav links still visible
- [ ] Left mode dock still on left side (280px wide)

**Resize to 980px width:**
- [ ] Nav links disappear
- [ ] Logo + buttons still visible
- [ ] Mode dock moves to horizontal bar **below** top nav
- [ ] Hero content reflows to single column

**Resize to 880px width:**
- [ ] Sound button disappears
- [ ] "Menu" icon still visible

---

## TEST 6: Mobile Layout

**Resize to 375px width (mobile portrait):**
- [ ] Everything stacks vertically
- [ ] Hero section readable
- [ ] Mode selector bar visible (horizontal, under nav)
- [ ] Project cards stack 1 per column
- [ ] Skills section readable
- [ ] Can scroll through page

**Can you:**
- [ ] Press B to switch modes on mobile?
- [ ] Click buttons without overlap?
- [ ] See all text clearly?

---

## TEST 7: Hero Content

**Verify these sections exist (scroll down slightly if needed):**
- [ ] "CHANNEL ACTIVE" chip visible (with pulsing dot)
- [ ] "VER 2.6.1" chip visible
- [ ] "WORLD-SIDE" or "OPERATOR LAYER" chip visible
- [ ] Four skills shown: ROBLOX LUA, TYPESCRIPT, BLENDER, SYSTEMS DESIGN
- [ ] NO fake metrics (old: "SHIPPED 12", "HOURS PLAYED 480K+") should be gone

---

## TEST 8: Skills Section

**Scroll to "Skills & Systems" section:**
- [ ] Title visible: "SKILLS & SYSTEMS"
- [ ] Four category panels: LANGUAGES, PLATFORMS & TOOLS, GAME SYSTEMS, PIPELINE & CRAFT
- [ ] Each has multiple skill chips (tags)
- [ ] NO progress bars (old fake percentage bars should be gone)

**Example:**
- LANGUAGES: Roblox Lua, TypeScript, JavaScript, Python, C++
- PLATFORMS & TOOLS: Roblox Studio, Blender, VS Code, Unity, Claude Code, GitHub

---

## TEST 9: Projects Section

**Scroll to "Featured Projects" section:**
- [ ] Title visible: "FEATURED PROJECTS"
- [ ] Four project cards in a row
- [ ] Each card shows:
  - [ ] Project name (Obelith, Zercsus Peak, Pirate Game, Cinematic Suite)
  - [ ] Status badge (IN DEV, PROTOTYPE, CONCEPT, LIVE)
  - [ ] Placeholder image area (says "Drop...")
  - [ ] Description text
  - [ ] Skill tags
  - [ ] "View Project →" button

---

## TEST 10: Video Showcase

**Scroll to "Showcase Channels" section:**
- [ ] Two video cards visible
- [ ] Each card shows:
  - [ ] Header with tag (e.g., "GRAVEYARD-REALM // OBELITH")
  - [ ] Large placeholder area (says "📹 Drop video thumbnail...")
  - [ ] Play button overlay (triangle icon)
  - [ ] "PLACEHOLDER" label (top right)
  - [ ] Status text at bottom (signal %, bitrate)

---

## TEST 11: Contact Section

**Scroll to "Ready to collaborate?" section:**
- [ ] Big heading visible
- [ ] "⚔ Let's Build Worlds" primary button
- [ ] Contact links grid:
  - [ ] Discord: gigakills
  - [ ] Roblox: @gigakills
  - [ ] YouTube: /c/gigakills
  - [ ] GitHub: github.com/gigakills
  - [ ] Email: hello@gigakills.dev

---

## TEST 12: Footer

**At bottom of page:**
- [ ] "SYSTEM STATUS: ONLINE" visible
- [ ] CONNECTION: SECURE, USER: GUEST_001, NODE: (mode-specific)
- [ ] Current time (UTC) visible
- [ ] Quote: "We don't just make games..."
- [ ] "— GIGAKILLS // OP_MANIFESTO_v3"

---

## TEST 13: Background Layer

**Critical for 3D Integration:**
- [ ] Background does NOT scroll (stays fixed)
- [ ] Can click buttons even over background (no pointer blocking)
- [ ] Content is sharp/readable over animated background
- [ ] No layout shift when mode changes
- [ ] Vignette (dark edges) doesn't interfere with nav

---

## TEST 14: Dark Mode Persistence

**Reload page:**
- [ ] Mode persists (stays in graveyard or matrix, whichever you set)
- [ ] Image placeholders persist (if you dropped images, they stay)

---

## TEST 15: Console Errors

**Open DevTools (F12) → Console:**
- [ ] No red error messages
- [ ] No warnings about missing images (placeholder slots are OK)

**Expected (these are OK):**
- Info messages from scene renderers
- Image slot warnings if no .state.json file exists (that's fine)

---

## PASS/FAIL SUMMARY

**✅ PASS** = All tests pass, proceed to 3D  
**⚠️ CONDITIONAL** = A few minor visual tweaks needed, but stable  
**❌ FAIL** = Something broke, needs debugging first  

---

## IF YOU FIND ISSUES

### Issue: Page is blank
- Check console for red errors
- Try opening from localhost instead of file:// (CORS issues)
- Refresh hard (Ctrl+Shift+R on Windows)

### Issue: No background visible
- Try switching modes (press B) — backgrounds are mode-specific
- Check that scene canvases are rendering (should be animated)

### Issue: Text unreadable / colors wrong
- Check you're in the right mode
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Layout broken on mobile
- Try landscape orientation
- Test on actual phone if possible (Chrome DevTools mobile emulation not 100% accurate)

### Issue: Buttons don't work
- Most buttons are placeholders (no href yet)
- Mode buttons and Breach button should work
- Check console for JavaScript errors

---

## PERFORMANCE CHECK (Optional)

**Open DevTools → Performance tab:**

1. Click record (red circle)
2. Scroll the page slowly once
3. Stop recording
4. Look at FPS chart at top
   - [ ] Maintains 60 FPS (or stable high frame rate)
   - [ ] No huge drops during mode switch

**What to expect:**
- Smooth 60 FPS during scrolling
- Brief dip (30 FPS) during breach animation (OK)
- Both scene renderers run at ~30-60 FPS

---

## READY FOR 3D?

Once all tests pass:

1. ✅ Core functionality stable
2. ✅ Background layer isolated and responsive
3. ✅ No blocker issues
4. ✅ Ready to replace scene canvases with Three.js

**Next step**: Create three-graveyard.js and three-matrix.js

