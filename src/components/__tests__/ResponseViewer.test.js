import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ResponseViewer from '../ResponseViewer.vue';
import { createTestingPinia } from '@pinia/testing';

describe('ResponseViewer', () => {
    it('renders response body and status', () => {
        const wrapper = mount(ResponseViewer, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            useMainStore: {
                                response: {
                                    body: 'Hello',
                                    status: 200,
                                    time: 123,
                                    size: 456,
                                    headers: '{}'
                                }
                            }
                        }
                    })
                ]
            }
        });
        expect(wrapper.text()).toContain('Hello');
        expect(wrapper.text()).toContain('200');
    });
});
