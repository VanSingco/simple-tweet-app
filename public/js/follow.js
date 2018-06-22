$(document).ready(function(){
    $('#follow').on('click', function(e){
        e.preventDefault();
        var user_id = $('#user_id').val();

        $.ajax({
            type:'POST',
            url: '/follow/' + user_id,
        }).done(function (data) {
            $('#follow').removeClass('btn-primary').addClass('btn-success')
                .html('Following').attr('id', 'unfollow');
        }).fail(function(data){
            console.log('Some Error: ', data)
        });
    });

     $('#unfollow').on('click', function (e) {
         e.preventDefault();
         var user_id = $('#user_id').val();

         $.ajax({
             type: 'POST',
             url: '/unfollow/' + user_id,
         }).done(function (data) {
             $('#unfollow').removeClass('btn-success').addClass('btn-primary')
                 .html('Follow').attr('id', 'follow');
         }).fail(function (data) {
             console.log('Some Error: ', data)
         });
     });
});