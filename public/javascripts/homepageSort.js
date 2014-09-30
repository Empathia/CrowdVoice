$(function (argument) {
    $('#voices').sortable({
        axis: 'y',
        dropOnEmpty: false,
        cursor: 'crosshair',
        items: 'li',
        opacity: 0.4,
        scroll: true,
        update: function(){
            $.ajax({
                type: 'put',
                data: $('#voices').sortable('serialize'),
                dataType: 'script',
                url: '/admin/homepage',
                complete: function(request){
                    $('#voices').effect('highlight');
                }
            });
        }
    });
});
