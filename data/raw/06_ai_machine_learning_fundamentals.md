# Artificial Intelligence and Machine Learning Fundamentals

## Supervised vs Unsupervised Learning
Machine learning algorithms build a model based on sample training data to make predictions or decisions without being explicitly programmed.
- **Supervised Learning**: The algorithm learns from labeled input-output pairs $(x, y)$. Common tasks include regression (predicting continuous values like house prices) and classification (predicting discrete classes like spam detection). Popular algorithms: Linear Regression, Logistic Regression, Decision Trees, Support Vector Machines (SVM).
- **Unsupervised Learning**: The algorithm discovers underlying patterns and groupings in unlabeled data. Common tasks include clustering (K-Means, DBSCAN) and dimensionality reduction (PCA, t-SNE).
- **Reinforcement Learning**: An agent learns optimal actions through trial-and-error by receiving rewards or penalties in an environment.

## Neural Networks and Gradient Descent
Artificial Neural Networks (ANNs) consist of interconnected nodes (neurons) organized in layers (input, hidden, output).
Each connection has a weight $w$ and bias $b$. The neuron computes an activation $a = \sigma(w^T x + b)$ where $\sigma$ is a non-linear activation function (ReLU, Sigmoid, Softmax).

Gradient Descent optimizes the loss function $L(\theta)$ by iteratively updating model weights in the opposite direction of the gradient:
$$\theta_{t+1} = \theta_t - \alpha \nabla L(\theta_t)$$
where $\alpha$ is the learning rate.
