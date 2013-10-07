Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['x', 'Keep Going','Swerve'],
            data: [
                { 'x': 'Keep Going', 'Keep Going' : '-10,-10', 'Swerve' : '2,-2' },
                { 'x': 'Swerve','Keep Going' : '-2,2', 'Swerve' : '0,0' }
            ]
        });
       
        this._play();
        
        var myGrid = Ext.create('Ext.grid.Panel', {
            title: 'matrix',
            store: store,
            sortableColumns: false,
            enableColumnMove: false,
            enableColumnHide: false,
            columns: [
                { text: 'x',  dataIndex: 'x' },
                { text: 'Keep Going', dataIndex: 'Keep Going'},
                { text: 'Swerve', dataIndex: 'Swerve' }
            ],
            height: 100,
            width: 307
        });
        this.add(myGrid);
        
        
        
    
        
        this.add(
        {
            xtype: 'rallychart',
            height: 400,
            chartConfig: {
                chart:{
		type: 'scatter',
                zoomType: 'xy'
		},
		title:{
		    text: 'The Game Of Chicken'
		},
		xAxis: {
                title: {
                    enabled: true,
                    tickInterval: 1,
                    text: 'Rounds'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                allowDecimals: false,
                },
		yAxis:{
		    title: {
                    text: 'Payoff'
                },
                allowDecimals: false
		},
                    legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 100,
                    y: 70,
                    floating: true,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1
            },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 10,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: 'round: {point.x} , payoff: {point.y}'
                        }
                    }
                },
            },
                            
            chartData: {
                series: [{
                    name: 'Player 1',
                    color: 'rgba(223, 83, 83, .5)',
                    data: [[1,0], [2,-2],[3,0],[4,2],[5,-10],[6,0]]
                }, {
                    name: 'Player 2',
                    color: 'rgba(119, 152, 191, .5)',
                    data: [[1,0], [2,2],[3,0],[4,-2],[5,-10],[6,0]]
                }]
            }
        });
    },
    _play:function(){
        this._data = [[0,0],[0,0]];
        var rounds = 10;
        var players = 2;
        var moves = [[],[]];
        var notRandom = ['keep going','swerve','swerve','swerve','swerve'];
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                var x = Math.floor(Math.random()*notRandom.length);
                moves[p].push(notRandom[x]);
                if (p===players-1) {
                   if ((moves[p][i] == "keep going")&&(moves[p-1][i] === "keep going")) {
                    console.log("[p][i]...", moves[p][i], "[p-1][i]...",moves[p-1][i] );
                    console.log("-10,-10");
                   }
                   else if ((moves[p][i] == "swerve")&&(moves[p-1][i] === "keep going")) {
                    console.log("[p][i]...", moves[p][i], "[p-1][i]...",moves[p-1][i] );
                    console.log("-2,2");
                   }
                   else if ((moves[p][i] == "keep going")&&(moves[p-1][i] === "swerve")) {
                    console.log("[p][i]...", moves[p][i], "[p-1][i]...",moves[p-1][i] );
                    console.log("2,-2");
                   }
                   else if ((moves[p][i] == "swerve")&&(moves[p-1][i] === "swerve")) {
                    console.log("[p][i]...", moves[p][i], "[p-1][i]...",moves[p-1][i] );
                    console.log("0,0");
                   }
                }
            }
        }
        
        
            
        console.log('moves',moves)

        
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                console.log(p,i);
                console.log(moves[p][i]);   
            }
        }
    }
});
