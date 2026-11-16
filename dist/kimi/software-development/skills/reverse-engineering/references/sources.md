# Sources · reverse-engineering

- Some of the approach is adapted from REA (Reverse Engineer Anything). See [NOTICE](../NOTICE).
- Real trial (2026-10 · an ASP.NET MVC system of about 55,000 lines): `ilspycmd` produced a C# project of 51,700 lines in 9 seconds. Compared with the real source, the cancel-order method matched on every statement, and all 1,431 method names matched.
- Drift check tried in both directions: a matching build gave 1,431 methods with no difference, and it caught a method renamed in a copy.
