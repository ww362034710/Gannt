import moment from 'moment';

export default {
    methods: {
        // 修改vuex中的数据副本.
        changeDataStore(id, vals) {
            this.sceneList.forEach(s => {
                if (id === s.activity.id) {
                    let scene = this.$$.extend(true, {}, s);
                    Object.keys(vals).forEach(v => {
                        scene.activity[v] = vals[v] instanceof moment ? moment(vals[v]).format('YYYY-MM-DD HH:mm:ss') : vals[v];
                    });

                    this.SET_SCENE({
                        sid: id,
                        scene: scene
                    });
                }
            });
        }
    }
};