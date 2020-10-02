import Vue from 'vue'
Vue.directive('auto', {
    bind: function(el, binding) {
        if (binding.hasOwnProperty('arg') && binding.arg === false) return;

        setResize(el, binding)
        window.addEventListener('resize', () => {
            setResize(el, binding)
        });
    }
})

function setResize(el, binding) {
    Vue.nextTick(() => {
        console.log('高度', el.dataset.diff)
        let a = el.getBoundingClientRect();
        if (a.x === 0) return;
        let diff = Number(el.dataset.diff) || 130;
        let _height = document.documentElement.clientHeight - a.top - diff;
        let _el = el.querySelector('.ant-table-body');
        _el.style.maxHeight = `${_height}px `;
        _el.style.overflowY = "scroll";
    })
}