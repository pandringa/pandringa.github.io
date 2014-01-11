/* ----------------------- Helpers ----------------------- */
function capitalizeFirst(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

String.prototype.replaceMultiple = function(replace, startChar){
	var start = startChar || "%=";
	var result = this;
	for(s in replace)
	{
		var i = result.indexOf(start+s);
		result = result.substring(0, i) + replace[s] + result.substring(i+start.length+s.length);
	}
	return result;
}


/* ----------------------- MODEL ----------------------- */
function enterAbout(){
	//$('#aboutText').transition({'display': 'block'}, 100).transition({'left': "0px"}, 1500);
	setTimeout(function(){$('#aboutImage').transition({'opacity': "1.0"}, 1500);}, 500);
}
function enterResume(){
	/*
	$(".resumeSection").each(function( index ){
		var self = this;
		setTimeout(function(){
			$(self).transition({'opacity': '1.0'}, 1300, 'ease');
		}, 800*index);
	})
	*/
}
function enterProjects(){
	/*
	var count = 0;
	$(".projectPanel").each(function( index ){
		var self = this;
		var waitTime = 0;
		if($(self).hasClass("projectPanel-left-center"))
			waitTime = 0;
		else if($(self).hasClass("projectPanel-right-center"))
			waitTime = 300;
		else if($(self).hasClass("projectPanel-left"))
			waitTime = 500;
		else if($(self).hasClass("projectPanel-right"))
			waitTime = 600;
		waitTime += 1000*(count / 4);
		setTimeout(function(){
			$(self).transition({'display': 'block'}, 100).transition({'left': "0px"}, 1500);
		}, waitTime);
		count++;
	})
	*/
}
function enterBlog(){
	/*
	var count = $('.blogPreview').length;
	$(".blogPreview").each(function( index ){
		var self = this;
		setTimeout(function(){
			$(self).transition({'opacity': '1.0'}, 100).transition({'top': "0px"}, 1200);
		}, 800*(count-index-1));
	});
	*/
	setTimeout(function(){
			$('#viewMore').transition({'opacity': '1.0'}, 1000);
		}, 200);
	
	
}
function enterContact(){
	return;
}
var palettes = [
	['#06A2CB', '#218559', '#EBB035', '#DD1E2F', '#D0C6B1'],
	['#3D4C53', '#70B7BA', '#F7E967', '#F1433F', '#A9CF54'],
	['#425C81', '#5EA032', '#D59859', '#620C67', '#D3D1D2'],
	['#656E75', '#679EC9', '#F1921A', '#669900', '#E6E7E8'],
]
var color = palettes[2];
var sections = [
	{color: '#425C81', id: '#head', name: 'head', entered: true, enter: function(){} },
	{color: '#5EA032', id: '#about', name: 'about', entered: false, enter: function(){if(!this.entered) enterAbout();} },
	{color: '#D59859', id: '#resume', name: 'resume', entered: false, enter: function(){if(!this.entered) enterResume();} },
	{color: '#923C97', id: '#projects', name: 'projects', entered: false, enter: function(){if(!this.entered) enterProjects();} },
	{color: '#D3D1D2', id: '#blog', name: 'blog', entered: false, enter: function(){if(!this.entered) enterBlog();} },
	{color: null, id: '#contact', name: 'contact', entered: false, enter: function(){if(!this.entered) enterContact();} }
]
function calculateTops(){
	for(var i=0; i<sections.length; i++){
		var sec = sections[i];
		sec.top = $(sec.id).offset().top;
	}
}
calculateTops();

var blogPostHtml = ""
		+"<a href='%=url' class='blogPreview-link'>"
		+"<div class='blogPreview%=ifTop'>"
		+	"<div class='blogPreview-meta'>"
        +           "<div class='blogPreview-title h4'>%=title"
        +                   "<span class='blogPreview-author'>%=author | %=date %=month %=year </span>"
        +           "</div>"
        +   " </div><br>"
        +   "<div class='blogPreview-post'>"
        +       	"%=description"
        +           "<a href='%=url' class='blogPreview-continue'>(Continued <i class='fa fa-arrow-right'></i>)</a>"
        +"</div></div></a>";

//Variable holds current location (based off url)
var idIndex = document.URL.indexOf("#");
var currLocation;
if(idIndex == -1)
	currLocation = 'head';
else
	currLocation = document.URL.substring(idIndex);

/* ----------------------- CONTROLLER ----------------------- */
var randomStuff;
var loadAsync = function(){
	var url =  "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q="+encodeURIComponent('https://medium.com/feed/@p_andringa');
	$.ajax({
	    type: 'GET',
	    url: url,
	    async: true,
	    jsonpCallback: 'jsonCallback',
	    contentType: "application/json",
	    dataType: 'jsonp',
	    success: function(json) {
			var posts = json.responseData.feed.entries;
			var MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			var html = "";
			for(var i=0; i<posts.length; i++){
				var d = new Date(posts[i].publishedDate);
				html += blogPostHtml.replaceMultiple({
					url: posts[i].link,
					ifTop: (i==0) ? " post-top" : "",
					author: posts[i].author,
					date: d.getDate(),
					month: MONTHS[d.getMonth()],
					year: d.getFullYear(),
					title: posts[i].title,
					description: posts[i].contentSnippet
				});
			}
			$('#fillPosts').html(html);
			$('#fillPosts').css('display', 'block');
			$('#loadingText').css('display', 'none');
	    },
	    error: function(e) {
			console.error(e.message);
	    }
	});
}


var equalHeights = function(elements){ //TODO make this work
	var h = 0;
	elements.each(function(){
		if($(this).height() > h)
			h = this.height;
	});
	elements.css('height', h);
}

//Scrolling animations
var scrollDuration = 2000;
$(function(){
	
	loadAsync();

	$('#nav').localScroll({duration:scrollDuration});
	$('#fixedNav').localScroll({duration:scrollDuration});
	$('#mobileNav').localScroll({duration:scrollDuration});
	$('#toTop').localScroll({duration:scrollDuration});
	$('#scrollDown').localScroll({duration:scrollDuration/3});
	
	equalHeights($('.projectPanel'));

	$('#fixedNav i').hover(
		function(){
			$(this).removeClass('fa-circle-o'); $(this).addClass('fa-dot-circle-o');
			$(this).next().css("display", 'inline');
		},function(){ 
			$(this).removeClass('fa-dot-circle-o'); $(this).addClass('fa-circle-o');
			$(this).next().css("display", 'none')
		}
	);
	$('.sectionTitle').hover(
		function(){
			$(this).children(".fa-link").css("display", 'inline');
		},function(){ 
			$(this).children(".fa-link").css("display", 'none');
		}
	);

	$('.toggle-menu').jPushMenu();
	$('.mobileMenu-links').click(function(){
		closeJPushMenu();
	});
});

function changeLocation(section){
	if(section.name == 'head'){
		title = 'Peter Andringa';
		window.history.pushState({location: section.name}, "/", "/");
	}else{
		title = 'Peter Andringa | '+capitalizeFirst(section.name);
		window.history.pushState({location: "#"+section.name}, "#"+capitalizeFirst(section.name), "#"+section.name);
	}

	
	// Hide/show fixed nav circles
	if(currLocation == 'head' && section.name != 'head'){
		$("#scrollDown").transition({'opacity': '0.0'}, 1000);
		setTimeout(function(){
			$('#fixedNav').css('display', '').transition({'opacity': '1.0'}, 2000);
			$('#toTop').css('display', '').transition({'opacity': '1.0'}, 2000);
			$('#mobileNav').css('display', '').transition({'opacity': '1.0'}, 2000);
		}, 500);
		setTimeout(function(){
			$("#scrollDown").css('display', 'none');
			 console.log("removing scroll");
		}, 1000);
	} else if(currLocation != 'head' && section.name == 'head'){
		$("#scrollDown").css('display', '').transition({'opacity': '0.7'}, 1000);
		$('#fixedNav').transition({'opacity': '0.0'}, 1000);
		$('#toTop').transition({'opacity': '0.0'}, 1000);
		$('#mobileNav').transition({'opacity': '0.0'}, 1000);
		setTimeout(function(){
			$('#fixedNav').css('display', 'none');
			$('#toTop').css('display', 'none');
			$('#mobileNav').css('display', 'none');
		}, 1000);
	}

	$("#i-"+section.name).removeClass('fa-circle-o'); $("#i-"+section.name).addClass('fa-dot-circle-o');
	$("#i-"+currLocation).removeClass('fa-dot-circle-o'); $("#i-"+currLocation).addClass('fa-circle-o');

	currLocation = section.name;
	//if(section.color != null)
	//	$('#background').transition({'background': section.color});

	setTimeout(section.enter, 200);
	setTimeout(calculateTops, 500);
	section.entered = true;
}
//Scroll detection for the stuff
$(window).scroll(function(){
	var screenCenter = ($(this).height()/5) + $(this).scrollTop();
	for(var i=sections.length-1; i>=0; i--){
		var sec = sections[i];
    	if(sec.top < screenCenter){
    		if(sec.name != currLocation)
    			changeLocation(sec);
    		break;
    	}
    }
});
$(window).resize(calculateTops);
