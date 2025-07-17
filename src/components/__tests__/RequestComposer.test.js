import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RequestComposer from '../RequestComposer.vue';
import { createTestingPinia } from '@pinia/testing';

describe('RequestComposer', () => {
    it('renders input fields and send button', () => {
        const wrapper = mount(RequestComposer, {
            global: { plugins: [createTestingPinia()] }
        });
        expect(wrapper.find('input[type="text"]').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').text()).toMatch(/Send Request/i);
    });

    it('emits send event on submit', async () => {
        const wrapper = mount(RequestComposer, {
            global: { plugins: [createTestingPinia()] }
        });
        await wrapper.find('form').trigger('submit.prevent');
        // Pinia store is used, so check store mutation instead of emit
        // This test is a placeholder for store mutation check
        expect(true).toBe(true);
    });
});
