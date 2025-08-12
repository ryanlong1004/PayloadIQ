// Plugin API documentation for PayloadIQ

/\*\*

- Plugin Structure
-
- Plugins should export an object with:
- {
- name: string,
- enabled: boolean,
- install(app, store): void
- }
-
- The install function is called with the Vue app instance and Pinia store.
- Plugins can add components, composables, routes, or modify store/actions.
  \*/

/\*\*

- Example Plugin
-
- export default {
- name: 'MyPlugin',
- enabled: true,
- install(app, store) {
-     // Add global component
-     app.component('MyComponent', MyComponent);
-     // Add store action
-     store.myAction = () => { ... };
- }
- }
  \*/

/\*\*

- PluginManager UI
-
- - List installed plugins
- - Enable/disable plugins
- - Install plugin from URL or file
- - Plugins are loaded at runtime
    \*/

/\*\*

- Marketplace (future)
-
- - Discover and install plugins from a community registry
- - Show plugin details, ratings, and compatibility
    \*/
