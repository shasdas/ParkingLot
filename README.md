# ParkingLot
## IoT Data Visualization using D3 and Pubnub - Car parking space status based on streamed data

![parkinglot](https://cloud.githubusercontent.com/assets/16579000/22978635/835b0270-f3b9-11e6-93ba-ae6bb7c0fc82.png)

### Description of Visual

	Grid is representing the parking space of a company.
	On hover parking number would be shown as tool tip to get information for that particular space.
	Sensor installed on the space could stream data to pubnub subscription via gateway.
	Pubnub listener gets notified based on streamed data which would get 
	plotted using D3 to give a picture of the parking space and available space based on live streaming.
	
### SetUp

	In grid.js, in the code block below, a pub-sub key set has to be given from the Pubnub subscription
	
	// pubnub registration
	var pubnub = new PubNub({
        publishKey : '<PUT_YOUR_PUB_KEY_HERE>',
        subscribeKey : '<PUT_YOUR_SUB_KEY_HERE>'
    });
	
	A set of dummy data would get published in 5 seconds interval to pubnub channel to simulate the visualization.
