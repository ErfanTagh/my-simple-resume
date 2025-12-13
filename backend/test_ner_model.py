#!/usr/bin/env python3
"""
Test script to see what the NER model extracts from the problematic text
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.resume_parser import ResumeParser

# The problematic text from education extraction
test_text = """Associate Developer
plus uni

RPTU Kaiserslautern

Projects AAS Sanity Project

for DFKI Smart Factory

project with Bootstrap frontend

and Flask backend

JSON file upload with

Fully containerized with Docker

Threading Bootstrap Docker NGINX

View Project Fully developed

React frontend and Flask

MongoDB database for card

Complete CI

CD pipeline with GitHub

Actions for automated testing

containerized with NGINX

accessible over HTTPS

React Flask MongoDB

Responsive Design

Languages English

Interests Running Cycling Language

Neocosmo Feb

Germany JavaScript TypeScript Git

CD Testing Debugging Agile

Code Reviews Software Development

Debugging Agile Methods Java

Magiavas Sep

Tehran Province

Iran Java OOP SQL

Git Debugging Java Development

Database Integration API Development

Software Architecture

Education Master of Computer

Science RPTU Kaiserslautern October

Present Kaiserslautern

Engineering Network Security Product

Line Engineering Social Web

Mining Data Visualization Foundations

of Digital Farming Bachelor

of Software Engineering Tehran

Azad University March

Algorithms Object

Working Student

Stack Software Development

Two years developing modern

software solutions with JavaScript

TypeScript for multiple major

Hochschule Kempten

Best Practices

Performed JavaScript

TypeScript migration with comprehensive

Implementation of

Agile Software Development

Complete development process from

CD pipelines

Independently handled complex features

Java Software Development

Two years practical experience

with Java

strong knowledge in OOP

Database Integration

Working with databases

SQL queries

and CRUD operations for

Implementation of API clients

HTTP request handling

JSON parsing

debugging of Java applications

Development of structured

MVC pattern and best

SKILLS"""

def main():
    print("=" * 80)
    print("🧪 Testing NER Model with Problematic Text")
    print("=" * 80)
    print(f"📝 Text length: {len(test_text)} characters\n")
    
    # Initialize parser
    parser = ResumeParser()
    
    # Load model
    print("🤖 Loading NER model...")
    parser._load_model()
    
    # Clean text for NER
    ner_text = parser._clean_text_for_ner(test_text)
    print(f"📝 Cleaned text length: {len(ner_text)} characters\n")
    
    # Run NER
    print("🔍 Running NER model...")
    entities = parser.ner_pipeline(ner_text[:4000])  # Limit to 4000 chars
    
    print(f"\n✅ Extracted {len(entities)} entities\n")
    
    # Group by type
    entities_by_type = {}
    for entity in entities:
        entity_type = entity.get('entity_group', 'UNKNOWN')
        if entity_type not in entities_by_type:
            entities_by_type[entity_type] = []
        entities_by_type[entity_type].append(entity)
    
    # Print results
    print("=" * 80)
    print("📊 RESULTS BY ENTITY TYPE:")
    print("=" * 80)
    for entity_type, entity_list in entities_by_type.items():
        print(f"\n🔹 {entity_type} ({len(entity_list)} entities):")
        for entity in entity_list[:15]:  # Show first 15 of each type
            word = entity.get('word', '')
            score = entity.get('score', 0)
            print(f"   - '{word}' (score: {score:.4f})")
        if len(entity_list) > 15:
            print(f"   ... and {len(entity_list) - 15} more")
    
    # Show all entities
    print("\n" + "=" * 80)
    print("📋 ALL ENTITIES (first 30):")
    print("=" * 80)
    for i, entity in enumerate(entities[:30]):
        entity_type = entity.get('entity_group', 'UNKNOWN')
        word = entity.get('word', '')
        score = entity.get('score', 0)
        start = entity.get('start', 0)
        end = entity.get('end', 0)
        print(f"{i+1:2d}. [{entity_type:20s}] '{word}' (score: {score:.4f}, pos: {start}-{end})")

if __name__ == "__main__":
    main()

