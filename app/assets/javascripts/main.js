//Well the doc is mix of jquery & javascript as I first decided to use pure js
// but later while creating ajax request .. It's a lot easier with jquery :P
$(document).on("ready page:load", function() {
    var landing = document.getElementById('landing-page');
    if(landing){
        handleInputStyleLoginPage();
    }else{
        loadContentColors();
        addTabListener();
        handleNotifications();
        sweetDeleteAlert();
        ajaxSearch();
        $("#new-note").autogrow();
        slideButtonDown();
        documentListeners();
        ajaxTagSuggestions();
        quickEditNote();
        linkToCreateNote();
        navbarToggle();
    }
});

function navbarToggle(){
    $("#nav-toggle").click(function(){
        $(this).toggleClass('active');
        $('.left-container').toggleClass('active');
    })
}
function linkToCreateNote(){
    $("#link-create-note").click(function(){
        $("#new-note").focus();
    });
}

function handleInputStyleLoginPage(){
    //the label moving around animation as we focus the input text on login page
    var group = document.getElementsByClassName('input-group');
    for (var i = 0; i < group.length; i++) {
        group[i].onclick = addLabelActiveClass; // group listenere ends
        var input = group[i].getElementsByTagName('input')[0];
        input.onblur = removeLabelActiveClass;
        input.onfocus = callLabelActiveClass;
    } //end for loop
}
    function callLabelActiveClass() {
        addLabelActiveClass.call(this.parentNode);
    }

    function addLabelActiveClass() {
        var label = this.getElementsByTagName('label')[0];
        var input = this.getElementsByTagName('input')[0];
        if (!label.classList.contains('active')) {
            label.classList.add('active');
            input.focus();
        }
    }

    function removeLabelActiveClass() {
        //only move label back if input is empty
        if (this.value === "") {
            var label = this.parentNode.children[0];
            if (label.classList.contains('active')) {
                label.classList.remove('active');
            }
        }
    }
function quickEditNote(element){
    "use strict";
    //replaces the note that is dbl clicked with the edit form 
    //element is used when note is loaded with ajax .. so to add this functionality even needs to be set again
    var each_note = element || document.getElementsByClassName('content');
    for(var i=0;i<each_note.length;i++){
        each_note[i].ondblclick = function(){
            var parent = this.parentNode;
            var id=parent.id.substr(parent.id.lastIndexOf('-')+1);
            var url = parent.children[1].getElementsByClassName('edit-link')[0].href;
            $.ajax({
                type:'GET',
                url:url,
                data:{
                    "id":id
                },
                //this is imp.. or the response won't be processed as js
                dataType: 'script'
            });
        };
    }
}
function ajaxTagSuggestions(){
    "use strict";
    // suggest tags when user create new note in textarea
    var hashPressed = false;
    var createNote = document.getElementById('new-note');
    if(createNote){
        var url = document.getElementById('suggest-tags-submit').href;
        createNote.onkeypress = function(e){
            //this is just a fix for fast typing # detection 
            if(e.keyIdentifier==="End"){
                hashPressed = true;
            }
        }
        createNote.onkeyup = function(e){
            if(e.keyIdentifier==="U+0033" && e.shiftKey===true){
                // this doesn't include the shift followed by 3 i.e fast typing
                // fixed it using onkeypress\
                hashPressed = true;
            }
            if(hashPressed===true){
                //if hash is already pressed & we gave a space or the content is empty
                if(e.keyIdentifier==="U+0020" || this.value==""){
                    // space so ends the suggestion
                    hashPressed= false;
                    hideSuggestionBox();
                }
            }
            if(hashPressed){
                var tagname = this.value.substring(this.value.lastIndexOf("#")+1,
                    this.value.length);
                // send this tagname & return the results in the div tag
                if(tagname!==""){
                    $.ajax({
                        type:'GET',
                        url:url,
                        data:{
                            "tagname":tagname
                        },
                        //this is imp.. or the response won't be processed as js
                        dataType: 'script'
                    });
                }
            }
        };
    }
    // add the tag for the respective span clicked
    $("#suggest-tags-area").click(function(e){
        if(e.target.nodeName==="SPAN"){
            var target = e.target;
            var tagname = target.innerText + " ";
            var content = createNote.value;
            // remove last #tag
            content = content.substring(0,content.lastIndexOf('#'));
            // add the new tagname
            content += tagname;
            //finally set that content
            createNote.value = content;
            //refocus the area
            createNote.focus();
            //hide the suggestions
            hideSuggestionBox();
        }
    });
}
function hideSuggestionBox(){
    "use strict";
    //helper function to hide the suggestion box 
    $('#suggest-tags-area').fadeOut();
    setTimeout(function(){
        $('#suggest-tags-area').html("");
    },200);
}
function documentListeners(){
    "use strict";
    //to retreat the animation when document is clicked
    document.onclick = function(e){
        if(e.target.id !== "new-note" 
            && e.target.id!=="suggest-tags-area" 
            && e.target.className!=="each-tag-suggestion" 
            //button shouldn't go back when create-note link nav is clicked
            && e.target.id!=="link-create-note" 
            && e.target.parentNode.id!=="link-create-note"
        ){
            // when anything other than textarea is clicked button is hidden back..
            $("#create-note button").removeClass('active');
            $("#all-notes").removeClass('active');
        }
        // hide notification & mark bell as clicked when document is clicked 
        $("#bell").removeClass('clicked');
        $("#notify-panel").removeClass('smoothUp');
    }
    //fix as the notification was closing on clicking inside it
    $("#notify-panel").click(function(){
        //stop triggering of document listener inside notify-panel
        return false;
    });
    
}
function slideButtonDown(){
    "use strict";
    var buttonClicked = false;
    $("#new-note").focus(function(e){
        $("#create-note button").addClass('active'); 
        $("#all-notes").addClass('active');
    });

    $("#create-note button").click(function(e){
            setTimeout(function(){
                //if button clicked then delay the hiding time
                $("#create-note button").removeClass('active');
                $("#all-notes").removeClass('active');
            },1000);
            e.stopPropagation();
    });

}
function ajaxSearch(){
    "use strict";
    // on keyup of input
    $("#search_form input").keyup(function(){
        //generate ajax request for action of form, .serialize() serialize the parameters of the form
        $.get($("#search_form").action,$("#search_form").serialize(),null,"script");
        return false;
    });
}

function sweetDeleteAlert() {
    "use strict";
    //Override the default confirm dialog by rails
    $.rails.allowAction = function(link) {
            if (link.data("confirm") == undefined) {
                return true;
            }
            $.rails.showConfirmationDialog(link);
            return false;
        }
        //User click confirm button
    $.rails.confirmed = function(link) {
            link.data("confirm", null);
            link.trigger("click.rails");
        }
        //Display the confirmation dialog
    $.rails.showConfirmationDialog = function(link) {
        var message = link.data("confirm");
        var myText = "You will not be able to recover this note!";
        var confirmMessage = "Your note has been deleted.";
        var cancelMessage =  "Your note is safe :)";
        if(link.data('ifuser')===true){
            // if user is deleted then construct the message acc to it
            myText = "You will not be able to recover this account!";
            confirmMessage = "Your account has been removed.";
            cancelMessage = "Phew! That was close. :)";
        }
        swal({
            title: "Are you sure?",
            text: myText,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel it!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm) {
            if (isConfirm) {
                swal("Deleted!", confirmMessage, "success");
                setTimeout(function(){
                    $.rails.confirmed(link);
                },1000);
            } else {
                swal("Cancelled",cancelMessage, "error");
            }
        });
    }
}

function loadContentColors(myContent) {
    "use strict";
    //sets color for tags(blue) & cusers (pink)
    var content = myContent || document.getElementsByClassName('content');
    for (var i = 0; i < content.length; i++) {
        var str = content[i].innerHTML;
        // any word & digit combination sepearted by _ or - and may or mayn't be followed by word & digit.
        //ex: _xyz or -23x isn't accepted
        //insert span color tag for tags
        var regx_tag = /(#[a-zA-Z0-9]+((_|-)[a-zA-Z0-9]+)*)/g;
        var tags_inserted = str.replace(regx_tag, '<span class="content-tag">$1</span>');
        //insert span color tag for user
        var regx_user = /(@[a-z0-9]+)/g;
        var result = tags_inserted.replace(regx_user, '<span class="content-user">$1</span>');
        content[i].innerHTML = result;
    }
}


function addTabListener() {
    "use strict";
    var tabLinks = document.getElementsByClassName('tab-links')[0];
    if (tabLinks) {
        tabLinks.addEventListener('click', handleTabs, false);
    }
}

function handleTabs(e) {
    "use strict";
    var target = e.target;
    if (!target.classList.contains('active')) {
        // if it's not active and it's a link tab
        var allLinks = target.parentNode.children;
        //highlight the clicked tab
        for (var i = 0; i < allLinks.length; i++) {
            if (allLinks[i] === target) {
                // active it
                target.classList.add('active');
            } else if (allLinks[i].className.indexOf('active') !== -1) {
                allLinks[i].classList.remove('active');
            }

        }
        //display correct content
        var contentsParent = document.getElementsByClassName('tab-content')[0];
        var contents = contentsParent.children;
        var href = target.href;
        var id = href.substr(href.indexOf('#') + 1);
        var contentToDisplay = document.getElementById(id);
        for (var i = 0; i < contents.length; i++) {
            if (contents[i] === contentToDisplay) {
                contentToDisplay.classList.add('visible');
            } else if (contents[i].className.indexOf('visible') !== -1) {
                // if found then delete it
                contents[i].classList.remove('visible');
            }
        }
    }
    e.preventDefault();
}

function handleNotifications() {
    "use strict";
    // on bell clicking show it
    var bell = document.getElementById('bell');
    if(bell){
        bell.onclick = function(e) {
            var notify_box = document.getElementById('notify-panel');
            if (this.classList.contains('clicked')) {
                this.classList.remove('clicked');
                notify_box.classList.remove('smoothUp');
            } else {
                this.classList.add('clicked');
                notify_box.classList.add('smoothUp');
            }
            // in jquery return false do 2 things.. e.preventDefaut & e.stopPropagation (i.e bubbling)
            e.stopPropagation();
            return false;
        };
    }
    //notification accordion
    var notifications = document.getElementsByClassName('each-request');
    for (var i = 0; i < notifications.length; i++) {
        notifications[i].onclick = function(e) {
            var target;
            //target is the container
            if (e.target.classList.contains('each-request')) {
                target = e.target;
            } else if (e.target.classList.contains('request-from') || e.target.classList.contains('request-note')) {
                target = e.target.parentNode;
            } else {
                target = e.target.parentNode.parentNode;
            }


            if (target.classList.contains('expandable')) {
                var viewNote = target.getElementsByClassName('request-note')[0];
                var closed = !(viewNote.classList.contains('visible'));
            }
            //close all excpet opened one
            for (var i = 0; i < notifications.length; i++) {
                if (notifications[i].classList.contains('expandable')) {
                    var hiddenNote = notifications[i].getElementsByClassName('request-note')[0];
                    if (hiddenNote.classList.contains('visible')) {
                        //if visible close it
                        hiddenNote.classList.remove('visible');
                        $(hiddenNote).slideUp(200);
                        var arrow = notifications[i].getElementsByTagName('i')[0];
                        arrow.classList.remove('active');
                    }
                }

            }

            if (closed) {
                //if opened then it has already been closed by above loop
                // so if closed open it
                viewNote.classList.add('visible');
                $(viewNote).slideDown(200);
                var arrow = target.getElementsByTagName('i')[0];
                arrow.classList.add('active');
            }
            e.stopPropagation();
        }; //end onclick
    }
}
