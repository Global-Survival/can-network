/* http://cesium.agi.com */

var cesiumLoaded = false;

function renderCesiumMap(o, v) {
	var cc = { };

	function render() {
		var ee = uuid();
		var vv = newDiv(ee);
		vv.attr('class', 'cesiumContainer');
		v.append(vv);
	
		cc.cesium = new Cesium.CesiumWidget(ee);

	}

	//ensure Cesium loaded
	if (!cesiumLoaded) {
		loadCSS('http://cesium.agi.com/Cesium/Build/Cesium/Widgets/CesiumWidget/CesiumWidget.css');

        LazyLoad.js("http://cesium.agi.com/Cesium/Build/Cesium/Cesium.js", render);		
	}
	else {
		render();
	}

	return cc;
}
