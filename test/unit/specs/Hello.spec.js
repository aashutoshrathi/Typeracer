import Vue from 'vue'
import Race from '@/components/Race'

describe('Race.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Race)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js PWA')
  })
})
