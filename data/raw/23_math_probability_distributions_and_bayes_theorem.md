# Probability, Random Variables, and Bayes' Theorem

## Probability Axioms and Conditional Probability
Probability quantifies the likelihood of events within a sample space $S$.
Conditional probability of event $A$ given that event $B$ has occurred ($P(B) > 0$) is defined as:
$$P(A | B) = \frac{P(A \cap B)}{P(B)}$$

## Bayes' Theorem
Bayes' theorem describes the probability of an event based on prior knowledge of conditions related to the event:
$$P(A | B) = \frac{P(B | A) \cdot P(A)}{P(B)}$$
where:
- $P(A | B)$ is the **Posterior Probability**: probability of hypothesis $A$ given evidence $B$.
- $P(B | A)$ is the **Likelihood**: probability of observing evidence $B$ if hypothesis $A$ is true.
- $P(A)$ is the **Prior Probability**: initial probability of hypothesis $A$ before seeing evidence $B$.
- $P(B)$ is the **Marginal Probability / Evidence**: total probability of evidence $B$, calculated via the Law of Total Probability $P(B) = \sum_i P(B | A_i) P(A_i)$.

## Discrete vs Continuous Probability Distributions
1. **Bernoulli and Binomial**: Models the number of successes in $n$ independent trials with probability $p$.
2. **Poisson Distribution**: Models the frequency of rare events occurring within a fixed time interval or space.
3. **Normal (Gaussian) Distribution**: Continuous probability distribution defined by mean $\mu$ and variance $\sigma^2$:
$$f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x - \mu}{\sigma}\right)^2}$$
By the **Central Limit Theorem**, the sum of independent, identically distributed random variables tends toward a normal distribution regardless of the original distribution shape.
