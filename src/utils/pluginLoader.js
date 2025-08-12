// Basic plugin loader for PayloadIQ
// Plugins should export an install(app, store) function

export const plugins = [];

export function registerPlugin(plugin) {
    if (typeof plugin.install === 'function') {
        plugins.push(plugin);
    }
}

export function loadPlugins(app, store) {
    plugins.forEach(plugin => {
        try {
            plugin.install(app, store);
        } catch (e) {
            console.error('Plugin install failed:', e);
        }
    });
}
