
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    // 第一套
    echarts.registerTheme('bar1', {
        color: ["#475f77", '#c83b3b', '#909481', '#2192bc', '#1f8a70', '#354b5e']   // 无红色
    });
    echarts.registerTheme('bar1', {
        color: ["#475f77", '#c83b3b', '#c83b3b', '#909481', '#2192bc', '#1f8a70', '#354b5e']   // 第二个红色
    });
    echarts.registerTheme('pie1', {
        color: ['#475f77', '#909481', '#2192bc', '#1f8a70', '#354b5e', '#8b4672', '#afaeae'] // 无红
    });
    echarts.registerTheme('pie2', {
        color: ['#c83b3b', '#68ac7a', '#df5327', '#418ab3', '#838383'] //红 绿  橙 蓝 灰
    });
    // 第二套
    echarts.registerTheme('bar21', {
        color: ["#4997ec", '#97c15d', '#f29c39', '#429488', '#4253af', '#54bad1']   // 无红色
    });
    echarts.registerTheme('bar22', {
        color: ["#4997ec", '#e15241', '#97c15d', '#f29c39', '#429488', '#4253af', '#54bad1']   // 第二个红色
    });
    echarts.registerTheme('pie21', {
        color: ['#ed9938', '#e15241', '#c53529', '#df6ca8'] // 无红
    });
    echarts.registerTheme('pie22', {
        color: ['#e15241', '#45a076', '#54bad1', '#4997ec', '#97c15d'] // 第一个红色
    });

    echarts.registerTheme('background', {
        //"color": [
        //    "#2093bd",
        //    "#d74a4a",
        //    "#344a5e",
        //    "#4b8ea8",
        //    "#f7c5a0",
        //    "#d4a4eb",
        //    "#d2f5a6",
        //    "#76f2f2"
        //],
        color: ["#147ea3", '#354b5e', '#a7aa9d', '#8b4672'],
        "backgroundColor": "rgba(247,247,247,0)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#000000"
            },
            "subtextStyle": {
                "color": "#dddddd"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "4"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "0",
            "symbol": "circle",
            "smooth": true
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "4"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "3"
                }
            },
            "symbolSize": "0",
            "symbol": "circle",
            "smooth": true
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            color: ['#68ac7a', '#c83b3b', '#df5327', '#418ab3', '#838383'], //红 绿  橙 蓝 灰
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#fc97af",
                    "color0": "transparent",
                    "borderColor": "#fc97af",
                    "borderColor0": "#87f7cf",
                    "borderWidth": "2"
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "1",
                    "color": "#ffffff"
                }
            },
            "symbolSize": "0",
            "symbol": "circle",
            "smooth": true,
            "color": [
                "#18e8e8",
                "#87b4f7",
                "#94d9f7",
                "#4b8ea8",
                "#f7c5a0",
                "#d4a4eb",
                "#d2f5a6",
                "#76f2f2"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#293441"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#f3f3f3",
                    "borderColor": "#999999",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(255,178,72,1)",
                    "borderColor": "#eb8146",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#893448"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(137,52,72)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#f3f3f3",
                    "borderColor": "#999999",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "rgba(255,178,72,1)",
                    "borderColor": "#eb8146",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#893448"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(137,52,72)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e6d7d7"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#fff3f3"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    //"color": "#fffbfb"
                    "color": "black"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#e6e6e6"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e6d7d7"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#fff3f3"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    //"color": "#fffbfb"
                    "color": "#black"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#e6e6e6"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e6d7d7"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#fff3f3"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#fffbfb"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#e6e6e6"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e6d7d7"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#fff3f3"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#fffbfb"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#e6e6e6"
                    ]
                }
            },
            "splitArea": {
                "show": true,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#fcf1f1"
                },
                "emphasis": {
                    "borderColor": "#ffffff"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "black"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#cccccc",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#cccccc",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#87f7cf",
                "width": 1
            },
            "itemStyle": {
                "normal": {
                    "color": "#87f7cf",
                    "borderWidth": "1"
                },
                "emphasis": {
                    "color": "#f7f494"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#87f7cf",
                    "borderColor": "#87f7cf",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "color": "#87f7cf",
                    "borderColor": "#87f7cf",
                    "borderWidth": 0.5
                }
            },
            "checkpointStyle": {
                "color": "#fc97af",
                "borderColor": "rgba(252,151,175,0.3)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#87f7cf"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#87f7cf"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#fc97af",
                "#87f7cf"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(255,255,255,0)",
            "dataBackgroundColor": "rgba(114,204,255,1)",
            "fillerColor": "rgba(114,204,255,0.2)",
            "handleColor": "#72ccff",
            "handleSize": "100%",
            "textStyle": {
                "color": "#333333"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#293441"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#293441"
                    }
                }
            }
        }
    });
}));
