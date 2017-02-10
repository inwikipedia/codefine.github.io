//添加class
function addClass(obj,iClass){
	var oriClass = obj.className.split(' ');
	var newClass = iClass.split(' ');
	for (var i=0; i<oriClass.length; i++) {
		for (var j=0; j<newClass.length; j++) {
			if (newClass[j]==oriClass[i]) {
				newClass.splice(j,1);
			}
		}
	}
	for (var i=0; i<newClass.length; i++) {
		oriClass.push(newClass[i]);
	}
	obj.className = oriClass.join(' ');
}

//删除class
function removeClass(obj,iClass){
	var oriClass = obj.className.split(' ');
	var newClass = iClass.split(' ');
	for (var i=0; i<oriClass.length; i++) {
		for (var j=0; j<newClass.length; j++) {
			if (newClass[j]==oriClass[i]) {
				oriClass.splice(i,1);
			}
		}
	}
	obj.className = oriClass.join(' ');
}

//获取元素到页面边界的距离
function getOffset(obj){
	var pos = {
		"left": 0,
		"top": 0
	};
	while (obj) {
		pos.left += obj.offsetLeft;
		pos.top += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return pos;
}