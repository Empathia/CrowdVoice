Class('SidebarSortController')({
    class_var : 'xxx',
    prototype : {
        instance_var : 'yyy',
        init : function (options){
            this.sortableTables = $("tbody");
            this.buildSortable();
            this.hovering = false;
            this.bindEvents();
            
            return true;
        },
        buildSortable: function(){
            var that = this,
                currentWrapper;
            this.sortableTables.sortable({
                axis:'y',
                containment: 'parent',
                items: 'tr',
                scroll: false,
                scrollSensitivity: 20,
                scrollSpeed: 20,
                start: function(event, ui){
                    var parents     = $(event.target).parentsUntil('.admin-sidebar-section'),
                        scroller    = parents.last(),
                        topScroller = scroller.prev(),
                        btmScroller = scroller.next();
                    topScroller.css('height',20).bind('mouseenter',function(){
                        that.hovering = true;
                        that.scrollSection(scroller, 'up');
                    }).bind('mouseleave', function(){
                        that.hovering = false;
                    });
                    btmScroller.css('height',20).bind('mouseenter',function(){
                        that.hovering = true;
                        that.scrollSection(scroller, 'down');
                    }).bind('mouseleave', function(){
                        that.hovering = false;
                    });
                },
                stop: function(event, ui){
                    var scroller = $(event.target).parentsUntil('.admin-sidebar-section').last(),
                        topScroller = scroller.prev(),
                        btmScroller = scroller.next();
                    topScroller.css('height',0).unbind('mouseenter');
                    btmScroller.css('height',0).unbind('mouseenter');
                    that.hovering = false;
                },
                sort: function(event, ui){
                    $(this).sortable( "refreshPositions" );
                },
                update: function() {
                  $.post('sort', '_method=post&authenticity_token='+AUTH_TOKEN+'&'+$(this).sortable('serialize'));
                },
                zIndex: 1
            }).disableSelection();

        },
        bindEvents : function(){
            var that = this;
            $(window).bind('load resize', function(){
                that.resizeTables();
            });
            $('.toggle').click(function(){
                var toggleControl = $(this),
                    parentTable = that.getParentTable(toggleControl);
                $(this).toggleClass('active');
                parentTable.find('tbody').slideToggle();
            });
        },
        resizeTables: function(){
            var viewportHeight  = $(window).height() - 198, //navBar and table headings
            tableSections       = $('section.with-table'),
            tableSectionsHeight = viewportHeight/2;
            tableSections.css({'height':tableSectionsHeight,'scrollTop':0});
        },
        getParentTable: function(toggleControl){
            var parentTable;
            toggleControl.parents().each(function(i){
                if ($(this).is('table')){
                    parentTable = $(this);
                }
            });
            return parentTable;
        },
        scrollSection: function(scroller, direction) {
            var that = this,
                currentScrollPos = scroller.scrollTop(),
                newScrollPos, scrollAmount;
            switch(direction){
                case 'up':
                    scrollAmount = -10;
                break;
                case 'down':
                    scrollAmount = 10;
                break;
            }
            setTimeout(function(){
                if (that.hovering) {
                    newScrollPos = currentScrollPos + scrollAmount;
                    scroller.scrollTop(newScrollPos);
                    that.scrollSection(scroller, direction);
                }
            },20);
        }
    }
});