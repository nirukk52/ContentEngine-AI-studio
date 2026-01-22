V0 = you **finish one full loop** using *your existing idea box*, but make it **style-locked + measurable**.

### What your V0 becomes inside your current UI

**Your idea edit box = the single entry point.**
User pastes:

* a topic, OR
* a script, OR
* “clone this video style” link

Then V0 runs this pipeline:

### 1) Script (you already do this)

Output: final narration text + emphasis words.

### 2) Scene Map (this is the missing step)

Instead of “create first frame”, you generate:

* **8 scenes**
* each scene has: *VO line + on-screen text + background tag + avatar rule*

### 3) Generate 3 variants (small but huge)

Same script → make:

* Variant A: strong shock hook
* Variant B: question hook
* Variant C: counter-intuitive hook
  Everything else same.

### 4) Render only 2 scenes first (fast loop)

Don’t render full video yet.
Render:

* Scene 1 (hook)
* Scene 2 (proof/context)

### 5) Run the Eval Scorecard

Score each variant on:

* hook strength
* style match
* caption readability
* rhythm

### 6) Winner picker

Auto-select the best variant → mark it as “winner”.

### 7) Continue generation only for winner

Now generate remaining scenes + full video only for the winner.

---

## Where “Style Pack” lives in your app

It’s a **dropdown / preset** next to the idea box.

Example:

* Style Pack: `Varun Explainer v1`
* Scene count: `8`
* Captions: `Kinetic`
* Avatar: `Hook + Takeaways`

---

## What you need to add (minimal)

1. **Scene Map JSON** step
2. **Variant generator** (3 hooks)
3. **Eval scoring + winner**
   That’s it.

Everything else you already have can stay.

**Q1:**

Do you want V0 to render full videos, or only hook+2 scenes until a winner is chosen?

**Q2:**

Should the variants change only the hook text, or also change captions + background energy?

**Q3:**

Do you want the Style Pack to be visible/editable in UI, or hidden config for now?
