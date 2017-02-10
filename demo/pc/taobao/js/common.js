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

//缓冲滚动
function easeScroll(iTarget){
	clearInterval(document.body.timer);
	var iStatus = 0;
	var iSpeed = 0;
	document.body.timer = setInterval(function (){
		iStatus = document.documentElement.scrollTop||document.body.scrollTop;
		if (iStatus>iTarget) {
			iSpeed = Math.floor((iTarget-iStatus)*0.1);
		} else {
			iSpeed = Math.ceil((iTarget-iStatus)*0.1);
		}
		if (iStatus==iTarget) {
			clearInterval(document.body.timer);
		} else {
			document.documentElement.scrollTop = document.body.scrollTop = iStatus + iSpeed;
		}
	},14);
}

//水平轮播
function xTab(obj,time){
	var tabCont = obj.querySelector('.tab-main');
	var aTabBtn = obj.querySelector('.tab-count').querySelectorAll('span');
	var oLeft = obj.querySelector('.btn-left');
	var oRight = obj.querySelector('.btn-right');
	var iDis = obj.clientWidth;
	var oPage = obj.querySelector('.page');
	var iNow = 0;
	indexActive();
	dirActive();
	autoPlay(time);
	//自动播放
	function autoPlay(time){
		obj.onmouseover = function (){
			clearInterval(obj.play);
		}
		obj.onmouseout = function (){
			autoPlay(time);
		}
		obj.play = setInterval(function (){
			iNow++;
			tabMove(iNow);
		},time);
	}
	//序号按钮响应
	function indexActive(){
		for (var i=0; i<aTabBtn.length; i++) {
			(function (n){
				aTabBtn[n].onclick = function (){
					iNow = n;
					tabMove(iNow);
				};
			})(i);
		}
	};
	//方向按钮响应
	function dirActive(){
		oLeft.onclick = function (){
			iNow--;
			tabMove(iNow);
		}
		oRight.onclick = function (){
			iNow++;
			tabMove(iNow);
		}
	};
	//缓冲轮播运动
	function tabMove(n){
		switch (n) {
			case -2:
				n = iNow = aTabBtn.length-2;
				tabCont.style.left = -aTabBtn.length*iDis + 'px';
				break;
			case aTabBtn.length:
				n = iNow = 0;
				tabCont.style.left = 0 + 'px';
				break;
		}
		if (oPage) {
			oPage.innerHTML = n + 1;
		}
		clearInterval(obj.timer);
		for (var i=0; i<aTabBtn.length; i++) {
			removeClass(aTabBtn[i],'active');
		}
		if (n==-1) {
			addClass(aTabBtn[aTabBtn.length-1],'active');
		} else {
			addClass(aTabBtn[n],'active');
		}
		var iOrig = tabCont.offsetLeft;
		var iTarget = -iDis*(n+1);
		obj.timer = setInterval(function (){
			var iStatus = tabCont.offsetLeft;
			if (iTarget<iStatus) {
				var iSpeed = Math.floor((iTarget-iStatus)*0.1);
			} else {
				var iSpeed = Math.ceil((iTarget-iStatus)*0.1);
			}
			if (iStatus==iTarget) {
				clearInterval(obj.timer);
				tabCont.style.left = iTarget + 'px';
			}
			tabCont.style.left = iStatus + iSpeed + 'px';
		},14);
	}
};


