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
                    data: this._data[0],
                    color: 'rgba(223, 83, 83, .5)',
                }, {
                    name: 'Player 2',
                    data: this._data[1],
                    color: 'rgba(119, 152, 191, .5)'
                }]
            }
        });
    },
    _play:function(){
        this._data = [[0,0],[0,0]];
        var rounds = 10;
        var players = 2;
        this._moves = [[],[]];
        var notRandom = ['keep going','swerve','swerve','swerve','swerve'];
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                var x = Math.floor(Math.random()*notRandom.length);
                this._moves[p].push(notRandom[x]);
                if (p===players-1) { 
                   if ((this._moves[p][i] == "keep going")&&(this._moves[p-1][i] === "keep going")) {
                    console.log("[p][i]...", this._moves[p][i], "[p-1][i]...",this._moves[p-1][i] );
                    this._data[p][i]=[i, -10];
                    this._data[p-1][i]=[i, -10];
                    
                   }
                   else if ((this._moves[p][i] == "swerve")&&(this._moves[p-1][i] === "keep going")) {
                    console.log("[p][i]...", this._moves[p][i], "[p-1][i]...",this._moves[p-1][i] );
                    this._data[p][i]=[i, -2];
                    this._data[p-1][i]=[i, 2];
                    
                   }
                   else if ((this._moves[p][i] == "keep going")&&(this._moves[p-1][i] === "swerve")) {
                    console.log("[p][i]...", this._moves[p][i], "[p-1][i]...",this._moves[p-1][i] );
                    this._data[p][i]=[i, 2];
                    this._data[p-1][i]=[i, -2];
                   }
                   else if ((this._moves[p][i] == "swerve")&&(this._moves[p-1][i] === "swerve")) {
                    console.log("[p][i]...", this._moves[p][i], "[p-1][i]...",this._moves[p-1][i] );
                    this._data[p][i]=[i, 0];
                    this._data[p-1][i]=[i, 0];
                   }
                }
                
                
            }
            console.log("DATA", this._data);
            console.log("DATA[0]", this._data[0]);
            console.log("DATA[1]", this._data[1]);
        }
        
        
            
        console.log('this._moves',this._moves)

        
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                console.log(p,i);
                console.log(this._moves[p][i]);   
            }
        }
    }
});
