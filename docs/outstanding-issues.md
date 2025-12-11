### Missing agents/skills:

* **UT-gen**: naming, structure of tests, inline comments "leaking", NOT testing angular boilerplate code, **marble testing for observables**. 
* **code-review**: Review didn't catch several typos.
* **solution-architect**: SA doc needs better, more refined structure. There was a diviation with the code match to 
* **buisness-analyst** (story validation) and proper language in the task file to avoid scope creep.

### Missing ADRs:

* **Angular structured directives**
* **Usage of standalone components**

### Other bugs:

1. Inline comments used to pivot/prime code generation needs improvement in the agent/ADR prompt
2. "Private methods should be located after public / protected ones", code-style ADR? Use of Angular MCP for agent?
3. ADR for accessibility is missing instruction: "(role-based) selectors in our tests over data-role attributes, with data-testid only as a fallback when a role-based selector is too cumbersome."
4. ADRs take prio over repo specs (always) - as a part of SA, Dev, QA agents.
5. "We should prefer inject over constructor injection" Angular stylegude? Another ADR?
