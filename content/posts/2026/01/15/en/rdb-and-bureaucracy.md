---
title: "Why Tables (RDBs) Still Dominate in Complex Systems ― A Journey Through Human History and Database Design ―"
date: 2026-01-15
description: "Exploring the historical roots of tabular data management and understanding why relational databases remain the go-to solution for complex, institutional systems."
lang: "en"
tags:
  - Database
  - RDB
  - Design Philosophy
  - History
draft: false
---
## Introduction

When designing systems, we often find ourselves questioning:  
"Wouldn't a document database be more flexible?"  
"Why do relational databases (RDBs) still dominate the landscape?"  

This is especially true when dealing with **complex relationships** involving people, organizations, contracts, and permissions.  
RDBs just feel "right" for these scenarios, but is this merely habit, or is there a **structural inevitability** at play?

This article explores:

1. The history of humanity managing data with tables  
2. The philosophical differences between RDBs and other databases  
3. Why RDBs grow stronger as complexity increases  
4. A concise summary  

## 1. When Did Humanity Start Managing Data with Tables?

Humanity didn't start using tables because of Excel or computers.

Tables emerged **right after the invention of writing itself**.

Ancient Mesopotamian clay tablets already recorded information in **row-and-column structures**:

- Items  
- Quantities  
- Dates  
- Responsible parties  

These weren't narratives or essays—they were practical records for **accounting, taxation, and labor management**.

Here's the key insight:

> Humanity first needed "accountability,"  
> and the most convenient form for that was tables.

Tables allow us to record  
"who, when, what, and how much"  
in a way that can be explained to third parties later.

This property hasn't changed in thousands of years.

## 2. How RDBs Differ from Other Databases

Modern databases can be broadly categorized as:

- Relational Databases (RDBs)
- Document Databases
- Graph Databases
- Vector Databases

It's more accurate to say these have **different philosophies** rather than being better or worse than one another.

### Document Databases

- Intuitive JSON-based structure  
- Flexible with schema changes  
- Ideal for read-heavy workloads  

However:

- Weaker global constraints  
- Consistency management falls on the application  
- Managing relationships becomes harder as they grow  

### Graph Databases

- Relationships take center stage  
- Strong at traversal and semantic understanding  

But:

- Aggregation  
- Auditing  
- Business rules  

These use cases significantly increase design and operational complexity.

### Relational Databases (RDBs)

- Data can be decomposed  
- Constraints can be made explicit  
- The database itself guarantees consistency  

While somewhat rigid,  
RDBs have an exceptionally **strong ability to clarify responsibilities and rules**.

## 3. Why Tables Excel in Complex Worlds

Counterintuitively,  
**the more complex the world becomes, the more tables shine**.

The reason is simple.

What complex systems truly need:

- Handling exceptions  
- Maintaining history  
- Clarifying who is responsible  

RDBs naturally support these by:

- Decomposing facts  
- Treating relationships as independent tables  
- Explicitly defining constraints  

For example, "the relationship between a person and an organization" isn't just an attribute—it's an **institutional fact** that includes:

- When did the affiliation begin?  
- What is their role?  
- Is it a primary or secondary position?  

These relationships **become much more robust the moment they're modeled as intermediate tables**.

## 4. The History of Tables and RDBs Share the Same Lineage

RDBs may look like modern technology,  
but they're actually **an extension of the table's historical lineage**:

- Ancient ledgers  
- Accounting books  
- Administrative records  
- Legal documents  

The features RDBs provide—

- Primary keys  
- Foreign keys  
- Constraints  
- Transactions  

—are simply technical formalizations of requirements humanity has felt for centuries: "this is how it must be done."

## 5. A Concise Summary

Let me sum up this discussion in one statement:

> **Tables (RDBs) aren't used because they're old.  
> They're used because they're the structure that survived  
> as humanity continued to handle responsibility and consensus.**

When flexibility is paramount,  
document databases and other technologies are incredibly effective.

However, when dealing with **social and institutional complexity** like:

- People  
- Organizations  
- Contracts  
- Permissions  
- Responsibilities  

The affinity of tables (RDBs) remains **overwhelmingly strong**.

This isn't just habit—  
it's a **structural inevitability**.
