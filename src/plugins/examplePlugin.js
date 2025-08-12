// Example community plugin for PayloadIQ
export default {
    name: 'Example Plugin',
    enabled: true,
    install(app, store) {
        // Add a custom action or UI
        console.log('Example Plugin installed!');
    }
};
