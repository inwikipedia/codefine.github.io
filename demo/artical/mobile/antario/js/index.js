(function (){
	
	//禁用touchstart默认事件
	document.addEventListener('touchstart',function (e){
		e.preventDefault();
	});
	setRem();
	preload();
	autoPers();
	
})();

//Step1-1：Rem适配
function setRem(){
	var oHtml = document.documentElement;
	var iWidth = oHtml.clientWidth;
	oHtml.style.fontSize = iWidth/16 + 'px';
	window.addEventListener('resize',setRem);
}

//Step1-2：景深适配
function autoPers(){
	var oView = document.querySelector('.view');
	var oMain = document.querySelector('.main');
	setPers();
	window.addEventListener('resize',setPers); //应对全屏或者横竖屏切换
	function setPers(){
		var cDeg = 50; //最大视野边界与视觉平面之间的锐角
		var iHeight = document.documentElement.clientHeight;
		var iPers = Math.round(Math.tan(cDeg*Math.PI/180)*iHeight*0.5); //动态景深
		oView.style.WebkitPerspective = oView.style.perspective = iPers + 'px';
		css(oMain,'translateZ',iPers); //景深与观察点Z轴相同
	}
}

//Step2-1：图片预加载及显示进度
function preload(){
	var oLoad = document.querySelector('.load');
	var oSpan = document.querySelector('.preload span');
	var n = 0; //加载进度百分比
	var m = 0;
	var data = [];
	for (var d in imgData) {
		data = data.concat(imgData[d]);
	}
	for (var i=0; i<data.length; i++) {
		var oImg = new Image();
		oImg.onload = function (){
			n++;
			oSpan.innerHTML = Math.floor(n/data.length*100);
			if (n==data.length) {
				endLoad();
			}
		};
		oImg.onerror = function (){
			m++;
			console.log(m);
		}
		oImg.src = data[i];
	}
}

//Step2-2：红色logo放大渐隐
function endLoad(){
	var oLoad = document.querySelector('.load');
	MTween({
		"el": oLoad,
		"target": {
			"opacity": 0,
			"translateZ": 1000
		},
		"time": 2000,
		"type": "easeInStrong",
		"callBack": function (){
			oLoad.removeChild(oLoad.children[0]);
			var oLogo = document.createElement('div');
			oLogo.className = 'imgBox rotateY';
			var oImg = new Image();
			oImg.src = imgData.logo[0];
			oLogo.appendChild(oImg);
			oLoad.appendChild(oLogo);
			css(oLoad,'translateZ',-600);
			rotateLogo(0);
		}
	});
}

//Step2-3-1&Step2-3-2(twice)：旋转往复彩色logo
function rotateLogo(n){
	var oLoad = document.querySelector('.load');
	var oImgBox = oLoad.querySelector('.imgBox');
	var oImg = oLoad.children[0].querySelector('img');
	oImg.src = imgData.logo[n];
	css(oLoad,'opacity',100);
	MTween({
		"el": oLoad,
		"target": {
			"translateZ": 120
		},
		"time": 300,
		"type": "easeBothStrong",
		"callBack": function (){
			setTimeout(function (){
				MTween({
					"el": oLoad,
					"target": {
						"translateZ": -600
					},
					"time": 2000,
					"type": "easeIn",
					"callBack": function (){
						setTimeout(function (){
							if (n==1) {
								explosion();
								return;
							}
							n++;
							rotateLogo(n);
						},200);
					}
				});
			},800);
		}
	});
}

//Step2-4：爆炸
function explosion(){
	var oView = document.querySelector('.view');
	var oLoad = document.querySelector('.load');
	var oImgBox = oLoad.querySelector('.imgBox');
	var oImg = oLoad.children[0].querySelector('img');
	oImg.src = imgData.logo[2];
	removeClass(oImgBox,'rotateY');
	var oExp = document.createElement('div');
	var oExpBox = document.createElement('div');
	oExp.className = 'exp';
	oExpBox.className = 'expBox exp-rotateY';
	var iNum = imgData.logoIco.length;
	//生成三维爆炸碎片
	for (var i=0; i<iNum*6; i++) {
		var oImg = new Image();
		oImg.src = imgData.logoIco[i%iNum];
		var iRX = 20 + Math.round(Math.random()*240); //随机XY平面半径
		var iRY = 10 + Math.round(Math.random()*320); //随机XZ平面半径
		var iDegX = Math.round(Math.random()*360); //随机XY平面偏转角
		var iDegY = Math.round(Math.random()*360); //随机XZ平面偏转角
		css(oImg,'rotateY',iDegX);
		css(oImg,'translateZ',iRX);
		css(oImg,'rotateX',iDegY);
		css(oImg,'translateY',iRY);
		oExpBox.appendChild(oImg);
	}
	oExp.appendChild(oExpBox);
	oLoad.appendChild(oExp);
	css(oExp,'scale',0);
	MTween({
		"el": oExp,
		"target": {'scale': 80},
		"time": 1500,
		"type": 'easeOut'
	}),
	MTween({
		"el": oLoad,
		"target": {
			"scale": 600
		},
		"time": 400,
		"type": "easeBothStrong",
		"callBack": function (){
			setTimeout(function (){
				MTween({
					"el": oExp,
					"target": {'scale': 0},
					"time": 500,
					"type": 'easeIn'
				});
				MTween({
					"el": oLoad,
					"target": {
						"scale": 0
					},
					"time": 1000,
					"type": "easeBothStrong",
					"callBack": function (){
						oView.removeChild(oLoad);
						mainIn();
					}
				});
			},1000);
		}
	});
}

//Step2-5：各层进场总控程序(Z轴方向靠近)
function mainIn(){
	var oViewZ = document.querySelector('.viewZ');
	css(oViewZ,'translateZ',-3000);
	MTween({
		"el": oViewZ,
		"target": {
			'translateZ': -150
		},
		"time": 4000,
		"type": "easeOut",
		"callBack": function (){
			infoShow();
			setInfoDrag();
			closeInfo();
		}
	});
	cloudIn();
	cylinderIn();
	allPano();
	allTag();
	setTimeout(function (){
		bgShow();
	},2000);
}

//Step2-6：云朵旋转
function cloudIn(){
	var oCld = document.querySelector('.cloud');
	var iLen = imgData.cloud.length;
	//生成随机云朵三维空间位置(角度固定，Y轴和半径随机)
	for (var i=0; i<iLen*3; i++) {
		var oImg = new Image();
		oImg.src = imgData.cloud[i%iLen];
		var iR = 500+(Math.random()-0.5)*100;
		var iDeg = 360/iLen/3*i;
		var iX = iR*Math.sin(iDeg*Math.PI/180);
		var iZ = iR*Math.cos(iDeg*Math.PI/180);
		var iY = (Math.random()-0.5)*400;
		css(oImg,'translateX',iX);
		css(oImg,'translateZ',iZ);
		css(oImg,'translateY',iY);
		oImg.style.display = 'none';
		oCld.appendChild(oImg);
	}
	var iNow = 0;
	//云朵逐个展现
	var timer = setInterval(function (){
		if (iNow == oCld.children.length-1) {
			clearInterval(timer);
		}
		oCld.children[iNow].style.display = 'block';
		iNow++;
	},100);
	MTween({
		"el": oCld,
		"target": {
			"rotateY": 745
		},
		"time": 4000,
		"type": "easeBoth",
		"callIn": function (){
			//每个云朵不旋转，始终以正面展示
			var revDeg = -css(oCld,'rotateY');
			for (var i=0; i<iLen*3; i++) {
				css(oCld.children[i],'rotateY',revDeg);
			}
		},
		"callBack": function (){
			oCld.parentNode.removeChild(oCld);
		}
	});
}

//Step2-7：圆柱旋转(正20边形近似于圆柱)
function cylinderIn(){
	var oCyl = document.querySelector('.cylinder');
	var iLen = imgData.bg.length;
	var iWidth = 129; //多边形每个面的宽度
	var iRot = 360/iLen; //多边形每个面的旋转角度
	var iDeg = 180*(iLen-2)/iLen; //多边形每个内角度数
	var iR = Math.floor(iWidth/2*Math.tan(Math.PI*iDeg/2/180)); //多边形每个面Z轴偏移半径
	css(oCyl,'rotateX',0);
	for (var i=0; i<iLen; i++) {
		var oImg = new Image();
		oImg.src = imgData.bg[i];
		oCyl.appendChild(oImg);
		css(oImg,'rotateY',180-iRot*i);
		css(oImg,'translateZ',-iR+1);
		oImg.style.display = 'none';
	}
	var iNow = 0;
	//多边形每个面逐个展现
	var timer = setInterval(function (){
		if (iNow == oCyl.children.length-1) {
			clearInterval(timer);
		}
		oCyl.children[iNow].style.display = 'block';
		iNow++;
	},2500/2/iLen);
	MTween({
		"el": oCyl,
		"target": {
			"rotateY": 745
		},
		"time": 4000,
		"type": "easeOut",
		"callBack": function (){
			setDrag();
			setSensors();
		}
	});
}

//Step2-8：背景展示
function bgShow(){
	var oBg = document.querySelector('.bg');
	oBg.className = 'bg bg-opacity';
}

//Step2-9-1：漂浮层工厂模式
function createPano(info){
	var oPano = document.querySelector('.pano');
	var oItem = document.createElement('div');
	oItem.className = 'item';
	var iLen = imgData.bg.length;
	var iWidth = 129;
	var iRot = 360/iLen;
	var iDeg = 180*(iLen-2)/iLen;
	var iR = Math.floor(iWidth/2*Math.tan(Math.PI*iDeg/2/180))-1; //-1减小半径，使圆柱与漂浮层分离
	css(oPano,'rotateX',0);
	css(oPano,'rotateY',745);
	css(oItem,'scale',0);
	css(oItem,'translateX',info.iDis.x);
	css(oItem,'translateZ',info.iDis.z);
	for (var i=info.iStartNum; i<info.iEndNum; i++) {
		var oImg = new Image();
		oImg.src = imgData.pano[i];
		oImg.style.cssText = info.iStyle;
		css(oImg,'translateY',info.iDis.y);
		css(oImg,'rotateY',info.iStartDeg);
		css(oImg,'translateZ',-iR);
		oItem.appendChild(oImg);
		info.iStartDeg -= iRot;
	}
	oPano.appendChild(oItem);
}

//Step2-9-2：创建所有漂浮层
function allPano(){
	var oPano = document.querySelector('.pano');
	createPano({
		"iStartNum": 0,
		"iEndNum": 2,
		"iStartDeg": 180,
		"iStyle": 'height:344px; margin-top:-172px',
		"iDis": {
			"x": 1.564,
			"y": -163,
			"z": -9.877
		}
	});
	createPano({
		"iStartNum": 2,
		"iEndNum": 5,
		"iStartDeg": 144,
		"iStyle": 'height:326px; margin-top:-163px',
		"iDis": {
			"x": 20.225,
			"y": 278,
			"z": -14.695
		}
	});
	createPano({
		"iStartNum": 5,
		"iEndNum": 9,
		"iStartDeg": 90,
		"iStyle": 'height:195px; margin-top:-92.5px',
		"iDis": {
			"x": 22.275,
			"y": 192.5,
			"z": 11.35
		}
	});
	createPano({
		"iStartNum": 9,
		"iEndNum": 14,
		"iStartDeg": 90,
		"iStyle": 'height:468px; margin-top:-234px',
		"iDis": {
			"x": 20.225,
			"y": 129,
			"z": 14.695
		}
	});
	createPano({
		"iStartNum": 14,
		"iEndNum": 20,
		"iStartDeg": 18,
		"iStyle": 'height:444px; margin-top:-222px',
		"iDis": {
			"x": -4.54,
			"y": -13,
			"z": 8.91
		}
	});
	createPano({
		"iStartNum": 20,
		"iEndNum": 26,
		"iStartDeg": 18,
		"iStyle": 'height:582px; margin-top:-291px',
		"iDis": {
			"x": -11.35,
			"y": 256,
			"z": 22.275
		}
	});
	createPano({
		"iStartNum": 26,
		"iEndNum": 29,
		"iStartDeg": -108,
		"iStyle": 'height:522px; margin-top:-261px',
		"iDis": {
			"x": -20.225,
			"y": 176.5,
			"z": -14.695
		}
	});
	createPano({
		"iStartNum": 29,
		"iEndNum": 35,
		"iStartDeg": -72,
		"iStyle": 'height:421px; margin-top:-210.5px',
		"iDis": {
			"x": -17.82,
			"y": -19.5,
			"z": -9.08
		}
	});
	setTimeout(function (){
		var num = 0;
		//漂浮层逐个展现
		var timer = setInterval(function (){
			if (num == oPano.children.length-1) {
				clearInterval(timer);
			}
			MTween({
				"el": oPano.children[num],
				"target": {
					"scale": 100
				},
				"time": 1000,
				"type": "easeOut"
			});
			num++;
		},200);
	},2000);
}

//Step2-10-1：标签工厂模式
function createTag(info){
	var oTag = document.querySelector('.tag');
	var oLink = document.createElement('div');
	oLink.className = 'link';
	oLink.dataset.name = info.name; //标签与展示信息映射关系
	var oBlink = new Image();
	oBlink.className = 'blink scale';
	oBlink.src = imgData.tag[10];
	css(oBlink,'translateZ',2);
	var oName = document.createElement('span');
	oName.className = 'name';
	oName.style.background = 'url('+imgData.tag[info.num]+') no-repeat';
	css(oName,'translateZ',-2);
	css(oTag,'rotateX',0);
	css(oTag,'rotateY',20);
	css(oLink,'rotateY',info.iRot);
	css(oLink,'translateY',info.iDis.y);
	css(oLink,'translateZ',info.iDis.z);
	oLink.appendChild(oBlink);
	oLink.appendChild(oName);
	css(oLink,'scale',60);
	oLink.style.display = 'none';
	oTag.appendChild(oLink);
	css(oTag,'rotateY',745);
}

//Step2-10-2：创建所有标签
function allTag(){
	var oTag = document.querySelector('.tag');
	createTag({
		"name": "fyl",
		"num": 0,
		"iRot": 290,
		"iDis": {
			"y": -400,
			"z": -380
		}
	});
	createTag({
		"name": "jqay",
		"num": 1,
		"iRot": 220,
		"iDis": {
			"y": -103.5,
			"z": -340
		}
	});
	createTag({
		"name": "lfx",
		"num": 2,
		"iRot": 148,
		"iDis": {
			"y": -162.9,
			"z": -360
		}
	});
	createTag({
		"name": "qdp",
		"num": 3,
		"iRot": 30,
		"iDis": {
			"y": -60,
			"z": -350
		}
	});
	createTag({
		"name": "rqly",
		"num": 4,
		"iRot": 215,
		"iDis": {
			"y": -400,
			"z": -360
		}
	});
	createTag({
		"name": "tp",
		"num": 5,
		"iRot": 152,
		"iDis": {
			"y": 310,
			"z": -360
		}
	});
	createTag({
		"name": "wd",
		"num": 6,
		"iRot": 106,
		"iDis": {
			"y": 120,
			"z": -350
		}
	});
	createTag({
		"name": "wjy",
		"num": 7,
		"iRot": 293,
		"iDis": {
			"y": 120,
			"z": -350
		}
	});
	createTag({
		"name": "zgl",
		"num": 8,
		"iRot": 60,
		"iDis": {
			"y": 210,
			"z": -350
		}
	});
	createTag({
		"name": "zjk",
		"num": 9,
		"iRot": 310,
		"iDis": {
			"y": -112,
			"z": -350
		}
	});
	//标签逐个展示
	setTimeout(function (){
		var num = 0;
		var timer = setInterval(function (){
			if (num == oTag.children.length-1) {
				clearInterval(timer);
			}
			oTag.children[num].style.display = 'block';
			num++;
		},200);
	},2000);
}

//Step2-10-3: 标签动态展示
function tagShow(){
	//此处宽度改变动画用transtion简单实现
	var oCyl = document.querySelector('.cylinder');
	var oTag = document.querySelector('.tag');
	window.tagRot = css(oCyl,'rotateY')>0 ? 360-css(oCyl,'rotateY')%360 : Math.abs(css(oCyl,'rotateY')%360); //场景旋转角度修正
	for (var i=0; i<oTag.children.length; i++) {
		(function (n){
			//用场景旋转角度与标签固有角度之间的差值判定是否即将靠近或远离标签
			if (Math.abs(window.tagRot-css(oTag.children[n],'rotateY'))<30) {
				oTag.children[n].querySelector('.name').style.width = '230px';
			} else {
				oTag.children[n].querySelector('.name').style.width = '0';
		}
		})(i);
	}
}

//step3-1：全景拖拽
function setDrag(){
	var oViewZ = document.querySelector('.viewZ');
	var oCyl = document.querySelector('.cylinder');
	var oPano = document.querySelector('.pano');
	var oTag = document.querySelector('.tag');
	var iLen = imgData.bg.length;
	var iWidth = 129;
	var iHeight = 1170;
	var iRot = 360/iLen;
	var cont = {}; //信息记录：圆柱
	var pano = {}; //信息记录: 漂浮层
	var ease = {}; //信息记录：缓冲旋转相关
	cont.scaleX = iRot/iWidth; //X轴旋转角度与距离关系
	cont.scaleY = 90/iHeight; //X轴旋转角度与距离关系
	document.addEventListener('touchstart',function (e){
		//如果商品展示页处于打开状态，禁用全景拖拽
		if (window.isShow) {
			return;
		}
		window.isTouch = true;
		clearInterval(oViewZ.timer);
		clearInterval(oCyl.timer);
		clearInterval(oPano.timer);
		clearInterval(oTag.timer);
		cont.origX = css(oCyl,'rotateY') ? css(oCyl,'rotateY') : 745;
		cont.origY = css(oCyl,'rotateX') ? css(oCyl,'rotateX') : 0;
		cont.startX = e.changedTouches[0].pageX;
		cont.startY = e.changedTouches[0].pageY;
		cont.startZ = css(oViewZ,'translateZ');
		ease.lastX = 0;
		ease.lastY = 0;
		ease.disX = 0;
		ease.disY = 0;
	});
	document.addEventListener('touchmove',function (e){
		//如果出现展示页，禁用全景拖拽
		if (window.isShow) {
			return;
		}
		cont.disX = e.changedTouches[0].pageX - cont.startX;
		cont.disY = e.changedTouches[0].pageY - cont.startY;
		cont.curX = cont.origX - cont.disX*cont.scaleX;
		cont.curY = cont.origY + cont.disY*cont.scaleY;
		pano.curX = cont.origX - cont.disX*cont.scaleX*0.8; //上下滑动时，漂浮层错位展示
		pano.curY = cont.origY + cont.disY*cont.scaleY*0.8; //左右滑动时，漂浮层错位展示
		//上下滑动范围限制
		if (cont.curY>15) {
			cont.curY = 15;
		} else if (cont.curY<-15) {
			cont.curY = -15;
		}
		if (pano.curY>15) {
			pano.curY = 15;
		} else if (pano.curY<-15) {
			pano.curY = -15;
		}
		css(oCyl,'rotateY',cont.curX);
		css(oPano,'rotateY',cont.curX);
		css(oTag,'rotateY',cont.curX);
		css(oCyl,'rotateX',cont.curY);
		css(oPano,'rotateX',cont.curY);
		css(oTag,'rotateX',cont.curY);
		ease.disX = cont.curX>ease.lastX ? Math.min(3,cont.curX-ease.lastX) : Math.max(-3,cont.curX-ease.lastX); //缓冲范围限制
		ease.disY = cont.curY>ease.lastY ? Math.min(3,cont.curY-ease.lastY) : Math.max(-3,cont.curY-ease.lastY); //缓冲范围限制
		ease.lastX = cont.curX;
		ease.lastY = cont.curY;
		cont.curZ = Math.max(-400,cont.startZ-Math.abs(cont.disX)); //Z轴偏移量限制
		css(oViewZ,'translateZ',cont.curZ);
		tagShow();
	});
	document.addEventListener('touchend',function (e){
		//如果出现展示页，禁用全景拖拽
		if (window.isShow) {
			return;
		}
		ease.startX = css(oCyl,'rotateY');
		ease.startY = css(oCyl,'rotateX');
		ease.curX = ease.startX + ease.disX*10;
		ease.curY = ease.startY + ease.disY*10;
		//上下缓冲范围限制
		if (ease.curY>15) {
			ease.curY = 15;
		} else if (ease.curY<-15) {
			ease.curY = -15;
		}
		MTween({
			"el": oViewZ,
			"target": {
				"translateZ": -150
			},
			"time": 800,
			"type": "easeOut"
		});
		MTween({
			"el": oCyl,
			"target": {
				"rotateY": ease.curX,
				"rotateX": ease.curY
			},
			"time": 800,
			"type": "easeOut"
		});
		MTween({
			"el": oPano,
			"target": {
				"rotateY": ease.curX,
				"rotateX": ease.curY
			},
			"time": 800,
			"type": "easeOut"
		});
		MTween({
			"el": oTag,
			"target": {
				"rotateY": ease.curX,
				"rotateX": ease.curY
			},
			"time": 800,
			"type": "easeOut",
			"callBack": function (){
				window.isTouch = false;
				window.isMove = false;
			}
		});
	});
}

//Step3-2: 陀螺仪
function setSensors(){
	var oViewZ = document.querySelector('.viewZ');
	var oCyl = document.querySelector('.cylinder');
	var oPano = document.querySelector('.pano');
	var oTag = document.querySelector('.tag');
	var iLen = imgData.bg.length;
	var iWidth = 129;
	var iRot = 360/iLen;
	var sens = {}; //信息记录：陀螺仪相关
	var cont = {}; //信息记录：圆柱
	sens.lastTime = Date.now();
	sens.iScale = iWidth/iRot;
	sens.startZ = css(oViewZ,'translateZ');
	window.isTouch = false; //全局控制：是否正在触摸滑动
	window.isMove = false; //全局控制：将陀螺仪旋转模拟为[开始touchstart]和[进行touchmove]两个阶段，便于初始数据记录
	window.addEventListener('deviceorientation',function (e){
		//如果商品展示页处于打开状态，禁用陀螺仪
		if (window.isShow) {
			return;
		}
		//如果正在全景拖拽，禁用陀螺仪
		if (window.isTouch) {
			return;
		}
		//如果陀螺仪单次运行时间小于MTween动画单次执行时间(20ms{MTween.js:230行}，30为误差修正值)，禁用陀螺仪
		sens.nowTime = Date.now();
		if (Math.abs(sens.nowTime-sens.lastTime)<30) {
			return;
		}
		sens.lastTime = sens.nowTime;
		var z = Math.round(e.alpha);
		//模拟：[开始]
		if (!window.isMove) {
			window.isMove = true;
			sens.curY = 0;
			sens.lastY = z;
			cont.startY = css(oCyl,'rotateY');
		//模拟：[进行]
		} else {
			tagShow();
			sens.disY = z - sens.lastY;
			if (sens.disY>5) {
				sens.disY = 5;
			} else if (sens.disY<-5) {
				sens.disY = -5;
			}
			sens.curY += sens.disY;
			cont.curY = cont.startY + sens.curY;
			sens.lastY = z;
			sens.disZ = Math.min(200,Math.abs((cont.curY-css(oCyl,'rotateY'))*sens.iScale));
			sens.curZ = sens.startZ - sens.disZ;
			MTween({
				"el": oViewZ,
				"target": {
					"translateZ": sens.curZ
				},
				"time": 300,
				"type": "easeOutStrong",
				"callBack": function (){
					MTween({
						"el": oViewZ,
						"target": {
							"translateZ": sens.startZ
						},
						"time": 300,
						"type": "easeOut"
					});
				}
			});
			MTween({
				"el": oCyl,
				"target": {
					"rotateY": cont.curY
				},
				"time": 500,
				"type": "easeOutStrong"
			});
			MTween({
				"el": oPano,
				"target": {
					"rotateY": cont.curY
				},
				"time": 700,
				"type": "easeOutStrong"
			});
			MTween({
				"el": oTag,
				"target": {
					"rotateY": cont.curY
				},
				"time": 500,
				"type": "easeOutStrong"
			});
		}
	});
}

//Step4：商品展示页开启
function infoShow(){
	var oTag = document.querySelector('.tag');
	var oInfo = document.querySelector('.info');
	for (var i=0; i<oTag.children.length; i++) {
		(function (n){
			oTag.children[n].addEventListener('touchstart',function (){
				if (Math.abs(window.orientation)==90) {
					return;
				}
				window.isShow = true;
				var name = this.dataset.name; //标签与展示信息映射关系
				var oTarget = oInfo.querySelector('.info-'+name+'');
				oInfo.style.display = 'block';
				oTarget.style.display = 'block';
			});
		})(i);
	}
}

//Step4-1: 商品展示页关闭
function closeInfo(){
	var oInfo = document.querySelector('.info');
	var aClose = document.querySelectorAll('.close');
	for (var i=0; i<aClose.length; i++) {
		(function (n){
			aClose[n].addEventListener('touchstart',function (){
				oInfo.style.display = 'none';
				this.parentNode.style.display = 'none';
				setTimeout(function (){
					window.isShow = false;
				},300);
			});
		})(i);
	}
}

//Step4-1: 商品展示页内容拖拽
function setInfoDrag(){
	var aScroll = document.querySelectorAll('.scroll');
	var scroll = {};
	for (var i=0; i<aScroll.length; i++) {
		(function (n){
			var oParent = aScroll[n].parentNode;
			css(aScroll[n],'translateY',0);
			aScroll[n].addEventListener('touchstart',function (e){
				scroll.minY = oParent.clientHeight - aScroll[n].scrollHeight;
				scroll.startPoint = e.changedTouches[0].pageY;
				scroll.startY = css(this,'translateY');
			});
			aScroll[n].addEventListener('touchmove',function (e){
				scroll.disY = e.changedTouches[0].pageY - scroll.startPoint;
				scroll.curY = scroll.startY + scroll.disY;
				if (scroll.curY<scroll.minY) {
					scroll.curY = scroll.minY;
				} else if (scroll.curY>0) {
					scroll.curY = 0;
				}
				css(this,'translateY',scroll.curY);
			});
		})(i);
	}
}
