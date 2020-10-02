import Vue from 'vue'
Vue.directive('tags', {
    bind: function(el) {
        setResize(el)
        window.addEventListener('resize', () => {
            setResize(el)
        });
    }
})

function setResize(el) {
    Vue.nextTick(() => {
        let a = el.getBoundingClientRect();
        if (a.x === 0) return;
        let diff = el.dataset.diff || 22;
        let _height = document.documentElement.clientHeight - a.top - diff;
        el.style.cssText = `height:${_height}px ;overflow:auto`;
    })
}