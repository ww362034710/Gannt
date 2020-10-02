StartTest(function (t) {
    var ts = new Gnt.data.TaskStore({
        proxy : 'memory'
    });
    var g = t.getGantt({ taskStore : ts, renderTo : document.body });

    var task = new Gnt.model.Task({ Name : 'foo' })

    ts.getRootNode().appendChild(task);

    task.remove();

    t.is(ts.getRootNode().isLeaf(), false, 'Rootnode is not leaf');

    ts.getRootNode().appendChild(task);

    t.is(ts.getRootNode().isLeaf(), false, 'Rootnode is not leaf');

    t.willFireNTimes(g.taskStore, 'update', 1);

    var task = g.taskStore.getRootNode().firstChild;

    task.setName('asfo');
})
