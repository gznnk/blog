---
title: "I built an AI-native drawing app designed with AI in mind, structured with JSON (Pre-Alpha)."
date: 2025-12-19
description: "A retrospective and introduction to the development of a JSON-based drawing app designed with AI in mind (Pre-Alpha)."
lang: "en"
tags:
  - AI
  - Development
draft: false
---
Starting with GitHub Copilot in February of this year, I have continued coding with the help of AI for about 10 months.
I have been developing an AI-native drawing application that holds its structure in JSON.
It is still a Pre-Alpha version, but since it has taken shape to some extent and the year is coming to an end, I would like to introduce it as a retrospective of my work so far.

## What I made
First, here is the code.
https://github.com/gznnk/json-draw-prealpha

And here is the actual running application.
https://gznnk.github.io/json-draw-prealpha/

Since it is a Pre-Alpha version, the code may not be organized, the UI is incomplete, and there are bugs, but the basic functions as a drawing application are mostly implemented.

## What I aimed for
The main points I aimed for in this application development are as follows:

* **Affinity with AI**: Designed with AI in mind, saving shape data in JSON format which is easy for AI to handle.
* **Challenging the limits of AI development**: Testing how large and complex an application can be built by personal development with the assistance of AI.

There were also other technical interests and verification items such as:
* Designing without being bound by library constraints by implementing it myself with the help of AI, using libraries as little as possible.
* How much drawing performance can be drawn out with React.
* Is it convenient to manage all information on a single canvas?
* How is a drawing application made in the first place?

## Was JSON compatible with AI?
In conclusion, I feel that the compatibility is good.
I see opinions that YAML is more suitable, but as far as I have tried, JSON was understood without any problems.

The JSON displayed in the demo is as follows. Note that it is huge.
https://github.com/gznnk/json-draw-prealpha/blob/main/data/sample.json

For example (I would like you to actually see the demo), the bottom right of the four screen designs is an HTML version based on the shape data above it. The position and color of each element are reproduced with high accuracy, indicating that the AI understands the structure of JSON firmly.

Also, the screen design on the bottom left is the same design with the design theme changed by asking Claude on VSCode. Since this is just changing colors, the difficulty level is low, but it suggests that processing JSON is also fully possible.
I think this is a battle with the context window rather than a data structure problem, so I think it is necessary to wait for the evolution of the LLM side or prepare the surrounding environment so that the AI can understand JSON by dividing it.

Besides that, looking at the sequence diagram, it understands the sequence (order and structure) properly, so I feel that the format is fine with JSON.

The model uses GPT-5, and anyone can try it by entering an API Key, so if you are interested, please try it out.
You can try various things in natural language, such as "What is the selected shape?", "Change the color of the shape", "Add a shape", etc.

## How much could be built by personal development

The amount of code in the Pre-Alpha version is as follows.

```
Total : 1273 files, 71738 codes, 9935 comments, 7130 blanks, all 88803 lines
```

I have been developing this steadily for 10 months in between my day job, housework, and childcare. The time spent is probably around 500 hours.
It calculates to writing about 143 lines of code per hour.
It may feel small now that AI generation is commonplace, but considering that it is the first drawing application I made and I made it while reviewing the structure many times, I feel that I was able to develop it efficiently.

The implemented functions are as follows.

* Move, scale, rotate shapes
* Change stacking order, group, duplicate, delete
* Change attributes (color, line thickness, etc.)
* Select multiple shapes
* Undo/Redo
* Zoom in/Zoom out, inertial scroll
* Edge connection, automatic edge routing
* AI Workflow
* Shape generation support by AI

And so on. There are other small functions, but due to trouble handling in my main job (it was a year of putting out fires...), my memory of the details is vague.

I realized painfully after actually making it, but drawing applications require packing a lot of processing into a single screen, which was extremely difficult.

In the early stages of development, I was able to proceed much more efficiently than without AI by having AI teach me unfamiliar geometric calculations or write them for me. However, as I got used to it to some extent and entered the phase where severe state management and performance tuning were required, the number of things that could not be solved by AI alone increased, and I ended up solving most of them on my own.

What I felt through these 10 months is that current AI (LLM) is ultimately a "plausible sentence generator". I felt that it is important to identify areas that can be solved by a "plausible sentence generator" and areas that cannot, and use them in the right place.

However, reading "The Unified Theory of the Brain" and such, there is a story that "the human brain is just inferring", so I also think that maybe it is just a matter of how to combine individual inferences. I would like to verify this area next year.

## Future
Another thing I found through development is that "it is impossible to pack all information onto a single canvas".
It is not so much a performance problem, but simply because the information cannot be organized and becomes messy.
I have been using Miro at work recently, but it is mostly scattered, so this may be a challenge for drawing applications in general.

Therefore, I plan to change the policy of consolidating in one place and proceed with development in the direction of dividing by file unit.
It seems that making a file explorer seriously will take time again, so I think it might be a good idea to make it a VSCode extension.
So I will continue to proceed steadily next year.
