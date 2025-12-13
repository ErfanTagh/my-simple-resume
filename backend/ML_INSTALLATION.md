# ML Dependencies Installation Guide

## Important Note

The resume parsing feature requires ML dependencies. PyTorch should be installed as the **CPU-only version** to save space and avoid CUDA dependencies.

## Installation Steps

1. **Activate your virtual environment:**

   ```bash
   source venv/bin/activate
   ```

2. **Install PyTorch CPU version first:**

   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cpu
   ```

3. **Install remaining ML dependencies:**

   ```bash
   pip install transformers>=4.20.0 pdfplumber>=0.9.0 PyPDF2>=3.0.0
   ```

   Or install all at once:

   ```bash
   pip install -r requirements.txt
   pip install torch --index-url https://download.pytorch.org/whl/cpu --upgrade
   ```

## Why CPU Version?

- **Smaller size**: ~184MB vs ~900MB+ for CUDA version
- **No GPU required**: Works on any server
- **Faster installation**: No CUDA dependencies
- **Sufficient for inference**: Resume parsing doesn't need GPU acceleration

## Verification

Test the installation:

```bash
python -c "import torch; import transformers; print('✅ All packages installed!')"
```

## Docker Installation

For Docker builds, the CPU version will be installed automatically via the Dockerfile.
