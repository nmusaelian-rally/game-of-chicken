Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        if (this.down("#ch")) {
        console.log("chart exists");
       }
       else{
        console.log("chart does not exists");
       }
        var that = this;
        this._store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: ['x', 'Keep Going','Swerve'],
            data: [
                { 'x': 'Keep Going', 'Keep Going' : '-10,-10', 'Swerve' : '2,-2' },
                { 'x': 'Swerve','Keep Going' : '-2,2', 'Swerve' : '0,0' }
            ] 
        });
       this._series = [];
       var c = Ext.create('Ext.Container', {
            items: [
                 {
                    xtype : 'grid',
                    title: 'matrix',
                    id: 'g',
                    store: this._store,
                    enableColumnMove: false,
                    enableColumnHide: false,
                    columns: [
                        { text: 'x',  dataIndex: 'x' },
                        { text: 'Keep Going', dataIndex: 'Keep Going'},
                        { text: 'Swerve', dataIndex: 'Swerve' }
                    ],
                    height: 100,
                     width: 307
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'reload with new data',
                    id: 'b1',
                    margin: 10,
                    handler: function() {
                        that._updateChart();
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'I want to play',
                    id: 'b2',
                    handler: function() {
                        that._playMyself();
                    }
                }
               
            ]
    });
       this.add(c); 
       this._play();

    },
    _play:function(){
        this._data = [[],[]];
        var rounds = 10;
        var players = 2;
        var playersArr = ['Player 1', 'Player 2'];
        this._moves = [[],[]];
        var notRandom = ['keep going','swerve','swerve','swerve','swerve'];
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                var x = Math.floor(Math.random()*notRandom.length);
                this._moves[p].push(notRandom[x]);
                if (p===players-1) { 
                   if ((this._moves[p][i] == "keep going")&&(this._moves[p-1][i] === "keep going")) {
                    this._data[p][i]=[i, -10,this._moves[p][i]];
                    this._data[p-1][i]=[i, -10,this._moves[p-1][i]];
                    
                   }
                   else if ((this._moves[p][i] == "swerve")&&(this._moves[p-1][i] === "keep going")) {
                    this._data[p][i]=[i, -2,this._moves[p][i]];
                    this._data[p-1][i]=[i, 2,this._moves[p-1][i]];
                    
                   }
                   else if ((this._moves[p][i] == "keep going")&&(this._moves[p-1][i] === "swerve")) {
                    this._data[p][i]=[i, 2,this._moves[p][i]];
                    this._data[p-1][i]=[i, -2,this._moves[p-1][i]];
                   }
                   else if ((this._moves[p][i] == "swerve")&&(this._moves[p-1][i] === "swerve")) {
                    this._data[p][i]=[i, 0,this._moves[p][i]];
                    this._data[p-1][i]=[i, 0,this._moves[p-1][i]];
                   }
                }    
            }
        }
        this._series.push({
		    	name: playersArr[0],
		    	data: this._data[0],
                        color: 'rgba(223, 83, 83, .5)'
				})
        this._series.push({
		    	name: playersArr[1],
		    	data: this._data[1],
                        color: 'rgba(119, 152, 191, .5)'
				})
        
        console.log("series", this._series);
        this._makeChart();
        
    },
    
    
    _updateChart:function(){
       if (this.down("#ch")) {
        console.log("chart exists. Removing chart...");
       }
       this.down("#ch").removeAll(); //not enough. series and data has to be emptied in the next two lines
       this._series.length = 0;
       this._data.length = 0;
       this._play();
       
    },
    
    _makeChart:function(){
        this.add(
        {
            xtype: 'rallychart',
            viewConfig: {
                loadMask: false
            },
            id: 'ch',
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
                tooltip: {
                        formatter: function() {
                            var info = this.series.name  + '<b> ' + this.point.config[2]  + '</b>' + '<br> ' + ' ' + 'round: <b>'+ this.x +'</b> payoff <b>'+ this.y +'</b>';
                            return info;
                        }
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
                        }
                    }
                },
            },
                            
            chartData: {
                series: this._series
            }
          
        });
        this.down('#ch')._unmask(); 
    },
    
    _playMyself:function(){
        var that = this;
        this._myMovesArray = [];
        this._opponentsMovesArray = [];
         
        console.log("_playMyself, init this._myMovesArr",this._myMovesArray);
        var controls = Ext.create('Ext.Container', {
            items: [
                {
                    xtype  : 'rallybutton',
                    text      : 'keep going',
                    id: 'b3',
                    margin: 10,
                    handler: function() {
                        that._move('keep going');
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'swerve',
                    id: 'b4',
                    margin: 10,
                    handler: function() {
                        that._move('swerve');
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'almost random',
                    id: 'b5',
                    margin: 10,
                    handler: function() {
                        that._move('almost random');
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'build chart of results',
                    id: 'b6',
                    margin: 10,
                    handler: function() {
                        that._loadDataOfInteractiveGame();
                    }
                },
               
            ]
        });
       this.add(controls);  
    },
    _move: function(move){
        
        if (move === "almost random") {
            var keepGoingOrSwerve = ['keep going','swerve','swerve','swerve','swerve'];
            var i = Math.floor(Math.random()*keepGoingOrSwerve.length);
            this._myMovesArray.push(keepGoingOrSwerve[i]);
            console.log("this._myMovesArray",this._myMovesArray);
            var j = Math.floor(Math.random()*keepGoingOrSwerve.length);
            this._opponentsMovesArray.push(keepGoingOrSwerve[j]);
            console.log("this._opponentsMovesArray",this._opponentsMovesArray);
        }
        else {
            this._myMovesArray.push(move);
            console.log("this._myMovesArray",this._myMovesArray);
            var keepGoingOrSwerve = ['keep going','swerve','swerve','swerve','swerve'];
            var x = Math.floor(Math.random()*keepGoingOrSwerve.length);
            this._opponentsMovesArray.push(keepGoingOrSwerve[x]);
            console.log("this._opponentsMovesArray",this._opponentsMovesArray); 
        }
    },
    _loadDataOfInteractiveGame: function(){
        console.log("_loadDataOfInteractiveGame");
    }
    
});