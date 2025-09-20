# LLM Prompt Engineering for Scientific Event Extraction

## 🔬 Project Overview

This is an project that I have undertaken as my thesis(on going), wherein we are exploring advanced **prompt engineering techniques** and **comparative LLM performance analysis** for scientific information extraction using the ZSEE (Zeolite Synthesis Event Extraction) dataset. Through systematic experimentation across multiple prompting strategies and LLM architectures, we are looking for significant insights into optimizing AI systems for domain-specific tasks.

## 🎯 Key Achievements

- **Comparative analysis of 3 state-of-the-art LLMs** with quantitative performance metrics
- **Automated evaluation pipeline** processing 300-400 API calls with intelligent rate limiting
- **Data-driven prompt optimization** resulting in measurable accuracy improvements
- **Domain expertise application** in scientific text processing and chemical synthesis workflows

## 🏗️ Technical Architecture

### Dataset Preparation
- **Source**: ZSEE Dataset (We took a sample of 100 scientific procedure sentences)
- **Data Engineering**: Custom preprocessing pipeline converting labeled outputs to structured dictionaries
- **Schema Design**: Standardized JSON format for event-argument extraction comparison

### Experimental Framework

#### 🥇 **Phase 1: Zero-Shot Baseline**
- **Objective**: Establish baseline performance across multiple LLM architectures
- **Models Tested**: 
  - Gemma-3-12B-IT
  - Gemini-2.5-Flash-Lite  
  - Gemini-2.5-Flash
- **Methodology**: Single comprehensive prompt with complete task specification
- **Output**: Comparative performance analysis across 100 sentences per model

#### 🥈 **Phase 2: Few-Shot Enhancement**
- **Innovation**: Strategic example selection from ZSEE dataset for in-context learning
- **Implementation**: 2 carefully curated examples integrated into prompt design
- **Hypothesis Testing**: Measured improvement in accuracy and consistency
- **Result**: Quantifiable performance gains in trigger_text extraction demonstrated across all tested models

#### 🥇 **Phase 3: Event-Specific Prompting** (Current Focus)
- **Advanced Strategy**: 16 specialized prompt functions targeting individual event types
- **Technical Challenge**: Two-stage extraction pipeline (events → arguments)
- **Scale**: 300-400 API calls per complete evaluation run
- **Focus Model**: Gemma-3-12B (due to API rate limit optimization)

## 💻 Technical Implementation

### Core Technologies
```python
# Key Libraries & APIs
import google.generativeai as genai  # Gemini API Integration
import pandas as pd                  # Data Analysis & Excel Output
import json, re, time               # Data Processing & Rate Limiting
from tqdm import tqdm               # Progress Monitoring
```

### Intelligent API Management
- **Rate Limiting**: Dynamic sleep intervals (8-14 seconds) preventing API throttling
- **Error Handling**: Robust exception management with graceful degradation
- **Progress Tracking**: Real-time monitoring of extraction pipeline
- **Data Persistence**: Automated Excel export with comprehensive metrics

### Performance Analytics Pipeline
```python
def extract_statistics(events):
    """Advanced metrics extraction for comparative analysis"""
    # Event-level metrics: count, types, trigger identification
    # Argument-level metrics: role accuracy, text span precision
    # Hallucination detection: duplicate identification, over-extraction analysis
```

## 📊 Key Findings & Insights

### Critical Discoveries
- **Temporal Context Issues**: Models struggle with past participle vs. active event distinction
- **Argument Duplication**: Most common in temperature (30x), duration (29x), sample (27x)
- **Prompt Adherence**: Even specialized constraints show 24% violation rate
- **Domain Complexity**: Scientific terminology requires enhanced context understanding

## 🧠 Prompt Engineering Innovations

### Event-Specific Function Architecture
```python
# Specialized extraction functions for each of 16 event types
def extract_add_arguments(sentence, trigger_text):
    """Precision-targeted prompt for Add events: material, temperature, container"""
    
def extract_stir_arguments(sentence, trigger_text):
    """Optimized prompt for Stir events: duration, temperature, revolution, sample"""
```

### Constraint-Based Prompt Design
- **Explicit Limitations**: "ONLY extract these specific arguments"
- **Schema Enforcement**: Structured JSON output requirements
- **Context Preservation**: Sentence + event type + trigger text integration
- **Error Prevention**: Built-in validation and format checking

## 🔍 Analysis & Problem-Solving Approach

### Pattern Recognition
- **Hallucination Taxonomy**: Categorized some distinct error types
- **Bias Detection**: Identified systematic over-extraction patterns (76% of cases)
- **Quality Assessment**: Developed metrics distinguishing model vs. dataset issues

### Critical Thinking Applications
- **Root Cause Analysis**: Differentiated between prompt design and model architecture limitations
- **Performance Attribution**: Isolated the impact of each experimental variable
- **Optimization Strategy**: Data-driven refinement based on quantitative feedback

## 🚀 Continuous Improvement Methodology

### Data-Driven Refinement
1. **Baseline Establishment**: Zero-shot performance measurement
2. **Hypothesis Testing**: Few-shot vs. specialized prompting comparison
3. **Iterative Enhancement**: Event-specific prompt optimization
4. **Quantitative Validation**: Excel-based performance tracking

### User Feedback Integration
- **Error Analysis**: Systematic review of model outputs vs. expected results
- **Prompt Iteration**: Refinement based on identified failure patterns
- **Performance Metrics**: Accuracy, precision, recall for each event type

## 🎯 Product Development Insights

### Scalability Considerations
- **API Cost Optimization**: Strategic model selection based on accuracy/cost trade-offs
- **Pipeline Efficiency**: Two-stage extraction reducing unnecessary processing
- **Error Handling**: Production-ready exception management

### Real-World Applications
- **Scientific Research**: Automated literature analysis for synthesis procedures
- **Knowledge Extraction**: Large-scale processing of technical documentation
- **Quality Assurance**: Systematic validation of AI-generated scientific content

## 📈 Future Roadmap

### Immediate Next Steps
- **Model Expansion**: Complete evaluation of Gemini-2.5-Flash variants
- **Prompt Optimization**: Further refinement based on current findings
- **Error Mitigation**: Address identified hallucination patterns


## 🛠️ Installation & Usage

```bash
# Clone repository
git clone https://github.com/yourusername/genai-scientific-extraction
cd genai-scientific-extraction

# Install dependencies
pip install google-generativeai pandas openpyxl tqdm

# Configure API keys
export GEMINI_API_KEY="your_api_key_here"

# Run experiments
python event_specific_extraction.py
```


## 🤝 Contributing

Contributions welcome! Areas of particular interest:
- Additional LLM model integrations
- Novel prompt engineering strategies  
- Enhanced evaluation metrics
- Domain-specific optimizations

---

**Note**: This project demonstrates production-level AI system development with emphasis on systematic evaluation, continuous improvement, and practical applications in scientific domains.
