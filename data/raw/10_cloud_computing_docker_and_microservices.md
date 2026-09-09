# Cloud Computing, Containers, and Microservices

## Cloud Service Models: IaaS, PaaS, and SaaS
Cloud computing provides on-demand availability of computing resources without direct active management by the user:
- **Infrastructure as a Service (IaaS)**: Provides raw virtualized hardware, virtual machines, networking, and storage (e.g. AWS EC2, Google Compute Engine).
- **Platform as a Service (PaaS)**: Provides a managed environment for developing, running, and managing applications without infrastructure configuration (e.g. Render, AWS Elastic Beanstalk, Heroku).
- **Software as a Service (SaaS)**: Delivers complete software applications over the web directly to end users (e.g. Google Workspace, Slack).

## Containerization with Docker
Containers package application code, dependencies, runtimes, and system libraries together into a lightweight, standalone executable image:
- **Containers vs Virtual Machines**: Unlike VMs that emulate an entire guest operating system via a hypervisor, containers share the host OS kernel, resulting in near-instant boot times and minimal resource overhead.
- **Microservices Architecture**: An architectural style where complex applications are decoupled into small, independent services communicating over lightweight protocols (HTTP REST, gRPC).
