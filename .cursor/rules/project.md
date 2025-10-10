# SAPUI5 Todo App Project Rules

## Code Style
- No comments in code unless explicitly requested
- Use English for all code, variable names, and function names
- Use Ukrainian for communication with the user
- Follow SAPUI5 naming conventions: controllers end with `.controller.js`, views with `.view.xml`

## SAPUI5 Specifics
- Always use `sap.ui.define` for module definition
- Use arrow functions in controllers where appropriate
- Prefer declarative XML views over programmatic UI creation
- Use data binding instead of manual DOM manipulation
- Follow Model-View-Controller (MVC) pattern strictly

## CSS
- Use `li[data-todo-item-completed="true"]` attribute selector for completed items styling
- Target SAPUI5-specific CSS classes like `.sapMCb`, `.sapMCbLabel`, `.sapMLabelTextWrapper`
- Use `!important` sparingly, only when SAPUI5 default styles override custom styles
- Test CSS changes in browser before committing

## Git
- Never commit or push without explicit user request
- Stage changes only when user asks
- Use meaningful commit messages in English

## Testing
- Use browser tools to verify UI changes
- Test completed todo items styling after CSS modifications
- Verify checkbox and label interactions work correctly

## Documentation
- All documentation (README, JIRA tickets, etc.) must be in English
- Code comments (if requested) must be in English
- Keep LEARNING_PLAN.md updated with progress

## File Structure
- Controllers: `webapp/controller/`
- Views: `webapp/view/`
- Models/Data: `webapp/model/`
- CSS: `webapp/css/`
- Utilities: `webapp/util/`
- Tests: `webapp/test/`

## Dependencies
- Use Context7 MCP for up-to-date library documentation
- Check SAPUI5 official docs before implementing features
- Keep package.json dependencies up to date via Renovate

## Communication
- Always respond in Ukrainian
- Use "ти" (informal) when addressing the user
- Keep explanations clear and concise
- Explain technical concepts with React parallels when relevant
