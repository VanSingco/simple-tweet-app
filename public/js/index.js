$(function(){
    var socket = io();

    $('#sendTweet').submit(function(){
        var content = $('#tweet').val();
        socket.emit('tweet', {content:content});
        $('#tweet').val('');
        return false;
    });

    socket.on('incommingTweets', function(tweet){
       var html = `
                <div class="card tweet-card">
                    <div class="card-body">
                        <div class="user-info d-flex align-items-center">
                            <div class="d-flex mr-auto">
                                <figure class="m-0">
                                    <img src="${tweet.user.photo}" class="user-info__img" alt="">
                                </figure>
                                <div class="user-info__text ml-3">
                                    <h5 class="user-info__text--name ">
                                        <a href="/user/${tweet.user._id}"> ${tweet.user.name}</a>
                                    </h5>
                                    <span class="user-info__text--username">@${tweet.user.username}</span>
                                </div>
                            </div>
                            <div class="">
                                <span class="time-date mr-3">Just now</span>
                            </div>
                        </div>
                        <div class="tweet mt-3 mb-3">
                            <p>${tweet.data.content}</p>
                        </div>
                        <div class="like-comment-share d-flex">
                            <div class="like mr-5">
                                <i class="far fa-heart"></i>
                            </div>
                            <div class="comment mr-5">
                                <i class="far fa-comment-alt"></i>
                            </div>
                            <div class="share mr-5">
                                <i class="fas fa-share-alt"></i>
                            </div>
                        </div>
                    </div>
                </div>`
        $('#tweets').prepend(html);
    });

})