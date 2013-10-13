Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
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
                    text      : 'reload with new almost readom data',
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
                },
                {
                    xtype: 'container',
                    id: 'bToPlay',
                    //disabled: true,
                    width: 600,
                    items: [
                        {
                    xtype  : 'rallybutton',
                    text      : 'keep going',
                    disabled: true,
                    id: 'b3',
                    margin: 10,
                    handler: function() {
                        that._move('keep going');
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'swerve',
                    disabled: true,
                    id: 'b4',
                    margin: 10,
                    handler: function() {
                        that._move('swerve');
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'almost random',
                    disabled: true,
                    id: 'b5',
                    margin: 10,
                    handler: function() {
                        that._move('almost random');
                    }
                },
                {
                    xtype  : 'rallybutton',
                    text      : 'build chart of results',
                    disabled: true,
                    id: 'b6',
                    margin: 10,
                    handler: function() {
                        that._loadDataOfInteractiveGame();
                    }
                }
                    ]
                },
                
               
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
            //height: 300,
            width: 600,
            chartConfig: {
                chart:{
		type: 'scatter',
                zoomType: 'xy'
		},
		title:{
		    text: 'The Game Of Chicken'
		},
                subtitle:{
		    text: '(Almost random data with weighted probability)'
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
        this._interactiveMoves = [[],[]];
        /*
        var min = 4;
        var max = min*2;
        this._range = {
            min: min,
            max: max
        };
        */
        //this._numberOfRounds = Math.floor((Math.random()*max)+min); //
        this._numberOfRounds = 4;
        console.log("this._numberOfRounds:",this._numberOfRounds);
        this._myMovesArray = [];
        this._opponentsMovesArray = [];
        this._punish = false;
        console.log("_playMyself, init this._myMovesArr",this._myMovesArray);
        this.down('#b2').setDisabled(true);
        this.down('#b3').setDisabled(false);
        this.down('#b4').setDisabled(false);
        this.down('#b5').setDisabled(false);
        this.down('#b6').setDisabled(false);    
    },
    
    _move: function(move){
        if (this._numberOfRounds>0) {
            if (move === 'almost random') {
                var keepGoingOrSwerve = ['keep going','swerve','swerve','swerve','swerve'];
                var i = Math.floor(Math.random()*keepGoingOrSwerve.length);
                this._myMovesArray.push(keepGoingOrSwerve[i]);
                console.log("this._myMovesArray",this._myMovesArray);
                var j = Math.floor(Math.random()*keepGoingOrSwerve.length);
                this._opponentsMovesArray.push(keepGoingOrSwerve[j]);
                console.log("this._opponentsMovesArray",this._opponentsMovesArray);
            }
            else {
                //determine the other player's move
                if (this._punish === true) {
                    this._opponentsMovesArray.push('keep going');
                }
                else{
                    var keepGoingOrSwerve = ['keep going','swerve','swerve','swerve','swerve'];
                    var i = Math.floor(Math.random()*keepGoingOrSwerve.length);
                    this._opponentsMovesArray.push(keepGoingOrSwerve[i]);   
                }
                console.log("this._opponentsMovesArray",this._opponentsMovesArray);
                //end of determining other player's move
                
                //your move
                this._myMovesArray.push(move);
                console.log("this._myMovesArray",this._myMovesArray);
                if (this._myMovesArray[this._myMovesArray.length-1] === 'keep going') {
                    this._punish = true;
                    console.log('this._punish',this._punish);
                }
                else{
                    console.log(this._myMovesArray[this._myMovesArray.length-1]);
                    this._punish = false;
                    console.log('this._punish',this._punish);
                }
                this._numberOfRounds--;
                if (this._numberOfRounds==0) {
                    console.log("round is over");
                    this.down('#b2').setDisabled(false);
                    this.down('#b3').setDisabled(true);
                    this.down('#b4').setDisabled(true);
                    this.down('#b5').setDisabled(true);
                    this.down('#b6').setDisabled(false);
                    console.log('this._myMovesArray', this._myMovesArray);
                    console.log('this._opponentsMovesArray', this._opponentsMovesArray);
                    this._interactivePlay();    
                }
            
            }
        }
    },
    
        
    _interactivePlay:function(){
        console.log('inside this._interactivePlay....');
        this._interactiveSeries = [];
        var players = 2;
        var playersArr = ['You', 'Player 2'];
        this._interactiveData = [[],[]];
        var rounds = 4;
        this._interactiveMoves = [[],[]];
        for (var i=0;i<this._opponentsMovesArray.length;i++) {
            this._interactiveMoves[1][i] = this._opponentsMovesArray[i];
        }
        for (var i=0;i<this._myMovesArray.length;i++) {
            this._interactiveMoves[0][i] = this._myMovesArray[i];
        }
        
        /* //test this._interactiveMoves array
        for (var i=0;i<this._interactiveMoves.length;i++) {
            for (var j=0;j<this._interactiveMoves[i].length;j++) {
                console.log('this._interactiveMoves[i][j]',this._interactiveMoves[i][j]);
            }
        }
        console.log('this._interactiveMoves[1][3]',this._interactiveMoves[1][3]);
        */
        
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                if (p===players-1) { 
                   if ((this._interactiveMoves[p][i] == "keep going")&&(this._interactiveMoves[p-1][i] === "keep going")) {
                    this._interactiveData[p][i]=[i, -10,this._interactiveMoves[p][i]];
                    this._interactiveData[p-1][i]=[i, -10,this._interactiveMoves[p-1][i]];
                    
                   }
                   else if ((this._interactiveMoves[p][i] == "swerve")&&(this._interactiveMoves[p-1][i] === "keep going")) {
                    this._interactiveData[p][i]=[i, -2,this._interactiveMoves[p][i]];
                    this._interactiveData[p-1][i]=[i, 2,this._interactiveMoves[p-1][i]];
                    
                   }
                   else if ((this._interactiveMoves[p][i] == "keep going")&&(this._interactiveMoves[p-1][i] === "swerve")) {
                    this._interactiveData[p][i]=[i, 2,this._interactiveMoves[p][i]];
                    this._interactiveData[p-1][i]=[i, -2,this._interactiveMoves[p-1][i]];
                   }
                   else if ((this._interactiveMoves[p][i] == "swerve")&&(this._interactiveMoves[p-1][i] === "swerve")) {
                    this._interactiveData[p][i]=[i, 0,this._interactiveMoves[p][i]];
                    this._interactiveData[p-1][i]=[i, 0,this._interactiveMoves[p-1][i]];
                   }
                }    
            }
        }
        this._interactiveSeries.push({
		    	name: playersArr[0],
		    	data: this._interactiveData[0],
                        color: 'rgba(223, 83, 83, .5)'
				})
        this._interactiveSeries.push({
		    	name: playersArr[1],
		    	data: this._interactiveData[1],
                        color: 'rgba(119, 152, 191, .5)'
				})
        
        console.log("_interactiveSeries", this._interactiveSeries);
        //this._makeChartOfInteractiveGame();
        this._updateChartOfInteractiveGame();
        
    },
    
     _updateChartOfInteractiveGame: function(){
        if (!this.down("#ch2")) {
           console.log('iteractive chart does not exist');
           this._makeChartOfInteractiveGame();
       }
       else{
            console.log('iteractive chart exists');
            this.down("#ch2").removeAll(); //not enough. series and data has to be emptied in the next two lines
            this._series.length = 0;
            this._data.length = 0;
            this._makeChartOfInteractiveGame();
       }
    },
    
        _makeChartOfInteractiveGame:function(){
        console.log('_makeChartOfInteractiveGame');
        this.add(
        {
            xtype: 'rallychart',
            viewConfig: {
                loadMask: false
            },
            id: 'ch2',
            //height: 300,
            width: 600,
            chartConfig: {
                chart:{
		type: 'scatter',
                zoomType: 'xy'
		},
		title:{
		    text: 'The Game Of Chicken'
		},
                subtitle:{
		    text: '(Data of the latest interactive game)'
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
                series: this._interactiveSeries
            }
          
        });
        this.down('#ch2')._unmask(); 
    },
    
    /*
    _loadDataOfInteractiveGame: function(){
        console.log("_loadDataOfInteractiveGame");
    }*/
    
});