function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function processNode(node) {
    if(node.children) {
        node.children.forEach(function(child) { processNode(child); });
    }
    if(node.url) { console.log(node.url); }
}

function tool_bar_open() {
    $('#header-block').addClass('slideDown');
    localStorage.show_toolbar = 'true';
}

function tool_bar_close() {
    $('#header-block').removeClass('slideDown');
    localStorage.show_toolbar = 'false';
}

function getGithubData(since) {
    $.ajax({

        url: "http://128.199.223.114:4040/trending",
        type: "GET",
        dataType: "json",
        success: function(data) {

            $('.github-data-spinner').hide();
            $('#allcategories').fadeIn(400);
            data.forEach(function(v,i){
                if(i<5){
                    $('#allcategories .d1').append('<td><a href="https://github.com/'+v.url+since+'"><p class="github-lang">'+'<span class="github-icon">❤</span> '+v.starts+'&nbsp&nbsp'+v.language+
                        '</p><p class="github-title">'+v.title.split('/')[1]+'</p><p class="github-description">'+v.description+
                        '</p></a></td>');
                }else if(i<10){
                    $('#allcategories .d2').append('<td><a href="https://github.com/'+v.url+since+'"><p class="github-lang">'+'<span class="github-icon">❤</span> '+v.starts+'&nbsp&nbsp'+v.language+
                        '</p><p class="github-title">'+v.title.split('/')[1]+'</p><p class="github-description">'+v.description+
                        '</p></a></td>');
                }
            });
        }

    });
}

$(document).ready(function() {
    var since = '';
    // data
    $('#allcategories').hide();
    getGithubData(since);
    // time
    $('#fancyClock').tzineClock();
    // i18n
    document.title = chrome.i18n.getMessage("application_title");
    $('#google-input-field').attr("placeholder", chrome.i18n.getMessage("google_search_text"));
    $('#github-input-field').attr("placeholder", chrome.i18n.getMessage("github_search_text"));
    $('#facebook-btn').html(chrome.i18n.getMessage("facebook_btn"));
    $('#yahoo-btn').html(chrome.i18n.getMessage("yahoo_btn"));
    $('#github-btn').html(chrome.i18n.getMessage("github_btn"));
    $('#youtube-btn').html(chrome.i18n.getMessage("youtube_btn"));
    $('#web-store-link-text').html(chrome.i18n.getMessage("web_store_link_text"));
    $('#top-sites-link-text').html(chrome.i18n.getMessage("top_sites_link_text"));



    // resize layout
    $(window).resize(function() {

        var window_height = $(window).height();
        var window_width = $(window).width();

        if (window_height<=600) {
            window_height = 600;
        }

        $('body').height(window_height);
        $('body').width(window_width);

        var left_width = window_height*0.65;
        var right_width = window_height*0.35;

        $('#main-content-inner').width(window_height);
        $('#github-photo-block').width(left_width);
        $('.image-frame').width(left_width-30);
        $('.image-frame').height(left_width-30);
        $('.image-frame').css('line-height', (left_width-30)+'px');
        $('.image-frame img').width(left_width-30);

        $('#search-bar-block').width(right_width-10);
        // $('#speech-input-field').width(right_width-60);
        $('.image-frame-small').width(right_width-55);
        $('.image-frame-small').height(right_width-55);
        $('.image-frame-small').css('line-height', (right_width-55)+'px');
        $('.image-frame-small img').width(right_width-55);

    });
    $(window).trigger('resize');

    // callback handler for google search form submit
    $("#google-search-form").submit(function(e) {
        var google_search = "https://www.google.com/#q="+$('#google-input-field').val();
        window.location = google_search;
        e.preventDefault(); //STOP default action
        e.unbind(); //unbind. to stop multiple form submit.
    });
    $("#github-search-form").submit(function(e) {
        var google_search = "https://www.google.com/#q="+$('#github-input-field').val()+' site:github.com';
        window.location = google_search;
        e.preventDefault(); //STOP default action
        e.unbind(); //unbind. to stop multiple form submit.
    });

    // switch button
    $('#tool-bar-switch').switchButton({
        checked: "true" == localStorage.getItem('show_toolbar'), //default null
        labels_placement: "left",
        on_label: chrome.i18n.getMessage("tool_bar_open"),
        off_label: chrome.i18n.getMessage("tool_bar_close"),
        on_callback: tool_bar_open,
        off_callback: tool_bar_close
    });

    // top site gravity button
    $(document.body).on('click', '#top-site-gravity', function() {

        $(".spinner").removeClass("animated fadeOut");
        $(".spinner").addClass("animated fadeIn");
        $(this).addClass("animated bounceOutDown");

        $('body').jGravity({ // jGravity works best when targeting the body
            target: '.top-sites-block-fixed', // Enter your target critera e.g. 'div, p, span', 'h2' or 'div#specificDiv', or even 'everything' to target everything in the body
            ignoreClass: 'ignoreMe', // Specify if you would like to use an ignore class, and then specify the class
            weight: 25, // Enter any number 1-100 ideally (25 is default), you can also use 'heavy' or 'light'
            depth: 5, // Enter a value between 1-10 ideally (1 is default), this is used to prevent targeting structural divs or other items which may break layout in jGravity
            drag: true // Decide if users can drag elements which have been effected by jGravity
        });

        $('.top-sites-block-fixed').css('visibility', 'visible');

        setTimeout(function () {
            $(".spinner").removeClass("animated fadeIn");
            $(".spinner").addClass("animated fadeOut");
        }, 3000);

        $('.boxgrid.slideright').hover(function(){
            $(".cover", this).stop().animate({left:'250px'},{queue:false,duration:300});
        }, function() {
            $(".cover", this).stop().animate({left:'0px'},{queue:false,duration:300});
        });

    });

    chrome.topSites.get(function(itemTree) {

        var site_count = 1;

        itemTree.forEach(function(item) {
            if (site_count<=5) {

                $('#content-block').append (
                    '<div class="boxgrid slideright top-sites-block-fixed">'+
                        '<img class="cover" src="http://api.webthumbnail.org/?width=250&height=200&screen=1024&url='+item.url+'"/>'+
                        '<h3>'+
                            '<a href="'+item.url+'">'+
                                'Top '+site_count+': '+item.title+
                            '</a>'+
                        '</h3>'+
                    '</div>'
                );
            }

            site_count++;

        });

    });

});
