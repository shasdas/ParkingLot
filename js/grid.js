function gridData() {
	var data = new Array();
	var offset = 100;
	var xpos = 1+offset; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1+offset; // adding offset value to move the grid little right and  bottom
	var width = 50;
	var height = 50;
	var click = 0;
	
	// iterate for rows	
	for (var row = 0; row < 10; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < 10; column++) {
			
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				parking: "Lot: " + (row +1).toString() + "/ No: " + (column +1).toString() + "" 
			})
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1+offset;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;	
	}
	return data;
}

function getRandomArrayElements(arr, count) {
			var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
			while (i-- > min) {
				index = Math.floor((i + 1) * Math.random());
				temp = shuffled[index];
				shuffled[index] = shuffled[i];
				shuffled[i] = temp;
			}
			return shuffled.slice(min);
		}

// pubnub registration
	var pubnub = new PubNub({
        publishKey : '<PUT_YOUR_PUB_KEY_HERE>',
        subscribeKey : '<PUT_YOUR_SUB_KEY_HERE>'
    });

var gridData = gridData();	

//console.log(gridData);

var svg = d3.select("#grid")
	.append("svg")
	.attr("width","710px")
	.attr("height","710px")

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var grid = svg
	.append("g")
	.attr("transform", "translate(100,0)");

svg.append("text")
.text("Company's Parking Lot")
.attr("x",351)
.attr("y",75)
.attr("font-family","sans-serif")
.attr("fill","#006d2c")
.attr('font-size', '20px');
	
var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");
	
var column = row.selectAll("g")
	.data(function(d) { return d; })
	.enter().append("g");

	column.append("rect")
	.attr("class","rect")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) {return d.width; })
	.attr("height", function(d) { return d.height; })
	.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.parking)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

// push data to pubnub channel in 5 seconds interval
setInterval(function(){
	
	var data = new Array();
	for (var i=0; i<10; i++)
		{
			data.push(getRandomArrayElements(gridData[i],8))
		}
			
	  pubnub.publish({
					  channel: "parking",
					  message: getRandomArrayElements(data, 10)
					  }
						);
	console.log("published...")
	
},5000);

console.log("Subscribing..");
// subscribe to channel of pubnub -- this is client side 
	 pubnub.subscribe({
        channels: ['parking'] 
		 });

pubnub.addListener({
	message: function(message) {
	var cars = grid.selectAll("g g text");
	//console.log(gridData);
	cars.remove();
	var data = message.message;
	var newRow = grid.selectAll(".row")
	.data(data)
	.selectAll("g")
	.data(function(d) { return d; })
	.append("text")
	.attr("x", function(d) {return d.x + 3; })
	.attr("y", function(d) { return d.y + 42; })
	.attr("font-family","FontAwesome")
	.attr("fill","#74c476")
  	.attr('font-size', function(d) { return d.width - 12 +'px';} )
	.text(function(d) { return '\uf1b9'; });
	}
});

