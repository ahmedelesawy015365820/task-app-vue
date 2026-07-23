import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App.vue', () => {
  it('renders the component without crashing', () => {
    const wrapper = mount(App, {
      global: {
        stubs: ['router-view']
      }
    })
    
    // Check if router-view stub is rendered
    expect(wrapper.find('router-view-stub').exists()).toBe(true)
  })
})
