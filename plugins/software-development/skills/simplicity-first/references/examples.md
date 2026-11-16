# Examples · simplicity-first


**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art
authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use
`?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various
initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on
transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a
dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard
auth middleware. Log to the existing system."

