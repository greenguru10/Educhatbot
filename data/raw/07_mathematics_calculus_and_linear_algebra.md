# Mathematics: Calculus and Linear Algebra Essentials

## Derivatives and Rate of Change
The derivative of a real-valued function $f(x)$ measures the sensitivity to change of the function value with respect to a change in its argument. Geometrically, the derivative represents the slope of the tangent line to the graph of the function at a given point:
$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

Key derivative rules:
- **Power Rule**: $\frac{d}{dx} x^n = n x^{n-1}$
- **Product Rule**: $\frac{d}{dx} [u(x)v(x)] = u'(x)v(x) + u(x)v'(x)$
- **Chain Rule**: $\frac{d}{dx} f(g(x)) = f'(g(x)) \cdot g'(x)$

## Linear Algebra: Vectors, Matrices, and Eigenvalues
Linear algebra is the mathematical language of computer graphics, quantum mechanics, and machine learning.
- **Vectors**: Elements of a vector space that have magnitude and direction.
- **Matrices**: Rectangular arrays of numbers representing linear transformations between coordinate spaces.
- **Eigenvalues and Eigenvectors**: For a square matrix $A$, a non-zero vector $v$ is an eigenvector if multiplying $A$ by $v$ only scales $v$ by scalar $\lambda$ (the eigenvalue):
$$A v = \lambda v$$
Eigen decomposition and Singular Value Decomposition (SVD) form the foundation of Principal Component Analysis (PCA) and modern recommendation engines.
