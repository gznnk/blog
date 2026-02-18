---
title: "Why I Could Never Quite Grasp the Term \"Use Case\""
date: "2026-02-06"
description: "A reflection on why the term \"Use Case\" is often confused between its meaning in business requirements and its meaning as an implementation unit in architecture."
lang: "en"
tags:
  - Design
  - Architecture
  - DDD
draft: false
---

I never quite felt comfortable with the term "Use Case".

Every time I heard discussions about "Use Case Layer" or "UseCase Class" in the context of DDD or Clean Architecture, I couldn't shake the feeling:

> Is that really a use case?

Recently, I finally understood the reason why.

## Use Case Actually Has Two Meanings

The cause of the confusion is simple:  
**The same term "Use Case" refers to different concepts.**

### 1. Use Case in the Context of Requirements and Business

This is the original meaning.

- How a user
- uses the system

It talks about **"how to interact with the system"**.  
Use case diagrams in UML and use cases discussed in requirement definitions refer to this.

It is completely an **outer concept**.

### 2. Use Case in Architecture

On the other hand, the "Use Case" mentioned in DDD or Clean Architecture is:

- Which data
- In what order
- To update collectively

It is a **unit of processing**.

In reality, it is closer to a **Transaction Boundary / Orchestration**.

It is completely an **inner (implementation) concept**.

## Why Did They End Up with the Same Name?

This was due to the philosophy of DDD and Clean Architecture.

> We want to trace business (requirements) directly into the code structure.  
> We want to make Use Cases the top-level concept in the code.

As a result, they tried to treat:

- Outer Use Cases (Human actions)
- Inner Processing Units (Units of data updates)

as **extensions of the same concept**.

Therefore, they effectively had to apply the name **UseCase** to "Transaction Boundaries".

I can understand the philosophy.  
But strictly speaking as a term, I feel it's a bit of a stretch.

## Why Was I Feeling Uncomfortable?

I think of systems in terms of:

- Data structures
- Constraints
- State transitions
- Transformations

Rather than:

- Human actions
- Business narratives

So when told:

> Unit of data change  
> = Use Case

I feel like **concepts are getting crossed**.

This wasn't a misalignment of senses, but simply that **the main axis of thinking was different**.

## My Current Understanding

- Business Use Case (Outer)
  - Interface between people and system
  - Requirements / Scenarios
- Architectural Use Case (Inner)
  - Transaction boundary
  - Unit of processing

I treat these two as **different things**.

I don't deny the philosophy of reflecting business in code itself.  
However, **there is no need to force them to match at the word level**.

In my mind, reading it as:

> "UseCase Layer" = Transaction / Operation / Application Service

makes the most sense to me.
