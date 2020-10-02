export default {
    namespaced: true,
    state: {
        sceneList: []
    },
    actions: {
        
    },
    mutations: {
        SET_SCENE_LIST(state, paylod) {
            state.sceneList = paylod;
        },
        SET_SCENE(state, paylod) {
            state.sceneList.forEach((s, i) => {
                if(s.activity.id === paylod.sid) {
                    console.log(s);
                    state.sceneList.splice(i, 1, paylod.scene);
                }
            });
        },
        REMOVE_SCENE(state, id) {
            state.sceneList = state.sceneList.filter(s => s.activity.id !== id);
        }
    },
    getters: {
        sceneList: state => state.sceneList,
        getSceneItemById: state => sceneId => state.sceneList.filter(s => s.id === sceneId)
    }
};