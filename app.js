'use strict';
const Homey = require('homey');
const { DeviceDiscovery } = require('sonos');

class MyApp extends Homey.App {
	onInit() {

		DeviceDiscovery((device) => {
			device.deviceDescription().then(dev => {
				if (dev.modelName === 'Sonos Playbar') {
					this.log('Found living room, registering action');
					let livingroom = device;
					let continueOnLivingRoomAction = new Homey.FlowCardAction('continue_livingroom');
					continueOnLivingRoomAction
						.register()
						.registerRunListener((args, state) => {
							this.log("Living room leaving group");
							return livingroom.leaveGroup().then(success => {
								this.log("Living room resuming");
								return livingroom.play();
							})
						});

				}
				if (dev.roomName === 'Bedroom') {
					this.log('Found bedroom, registering trigger');
					let bedroom = device;
					let bedroomStoppedTrigger = new Homey.FlowCardTrigger('bedroom_stopped');
					bedroomStoppedTrigger.register();
					bedroom.on('PlayState', state => {
						this.log('Bedroom state changed to ' + state);
						if (state === 'stopped') {
							bedroomStoppedTrigger.trigger();
						}
					});
				}
			});
		});
	}
	
}

module.exports = MyApp;
