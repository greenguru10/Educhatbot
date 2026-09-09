# Artificial Intelligence: Deep Learning and Transformer Architectures

## Deep Learning and Multi-Layer Perceptrons
Deep learning employs neural networks with multiple hidden layers to extract hierarchical feature representations directly from raw inputs without manual feature engineering.
Key activation functions:
- **ReLU (Rectified Linear Unit)**: $f(x) = \max(0, x)$, mitigating vanishing gradients in deep networks.
- **Softmax**: Converts unnormalized logit vectors into a normalized probability distribution $\sigma(z)_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$ for multi-class classification.

## The Transformer Architecture and Self-Attention
Introduced in "Attention Is All You Need" (Vaswani et al.), the Transformer replaces recurrent layers (RNNs/LSTMs) with **Multi-Head Self-Attention**, enabling massive parallelization during training.

### Scaled Dot-Product Attention Equation
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$
where:
- $Q$ (Query), $K$ (Key), and $V$ (Value) are linear projections of token embeddings.
- $\sqrt{d_k}$ scales down the dot product to prevent gradient saturation in the softmax function.

## Large Language Models (LLMs) and Pre-training
Modern LLMs (GPT, LLaMA, Gemini) are decoder-only or encoder-decoder Transformer models pre-trained on massive web-scale corpora via auto-regressive next-token prediction:
1. **Pre-training**: Unsupervised learning of general language grammar, facts, and reasoning patterns.
2. **Instruction Fine-Tuning (SFT)**: Supervised tuning on human instructional question-answer pairs.
3. **RLHF (Reinforcement Learning from Human Feedback)**: Alignment with human preferences for helpfulness and safety.
