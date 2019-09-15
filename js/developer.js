// Satham Ussain
// Developer Code
$('document').ready(function(){
  var base_url=tmp_base_url;

  // User Pop Up Login
  $('.popupLogin').click(function(e){
        e.preventDefault();
        $('.p_login_username_error,.p_login_password_error').html('');
        var username=$('.popupEmail').val();
        var password=$('.popupPassword').val();
        $.ajax({
            url:base_url+'home/AjaxPopUpLogin',
            dataType: 'json',
            data: {user_name:username,password:password},
            type:'POST',
            success:function(data){
               if(data.status==2){
                    $('.popUpEmailError').html(data.user_name);
                    $('.popUpPasswordError').html(data.password);
                }
                if(data.status==1){
                    $('.popupFOrm').removeClass('active');
                      if(data.login_status==1){
                            swal("Login Successfully..", {
                            icon: "success",
                            title: "success",
                          }).then(() => {
                          window.location.href = '';});  
                      }
                      else if(data.login_status==2){
                            swal("Account suspended. Contact our team", {
                            icon: "warning",
                            title: "Information",
                          }).then(() => {
                          window.location.href = '';}); 
                      }
                      else if(data.login_status==3){
                          window.location.href = 'verify-otp';
                      }
                }
            }
        });
  });

  // User Dashboard Function
  // View Service Pop Up Details
	  $(document).on('click','.clt_enquiry_view_trigger',function(){
	  		var data_id=$(this).attr('data-id');
	  		$.ajax({
	  			url:base_url+'user/fetch_popup_enquiry',
	  			type:'POST',
	  			data:'id='+data_id,
	  			success:function(data){
	  				var test=data.split('--@--');
	  				$('.pop_up_service_title').text(test[0]);
	  				$('.pop_up_service_content').html(test[1]);
	  			}
	  		});
	  });

  // Client Chat View Trigger
  	$(document).on('click','.clt_chat_trigger',function(){
  		var id=$(this).attr('data-id');
  		$.ajax({
  			url:base_url+'user/AjaxChatInit',
  			type:'POST',
  			data:'id='+id,
  			success:function(data){
  				var tmp=data.split('--@--');
  				$('.msg_id').val(tmp[0]);
          $('.msg_card_body').html(tmp[3]);
  				$('.userProfile').css('background-image','url('+tmp[1]+')');
  				$('.adminProfie').css('background-image','url('+tmp[2]+')');
  				$('.chatBody').scrollTop($('.chatBody').prop("scrollHeight"));
  			}
  		});
      ChatBeat();
  	});

  // Chat Msg Fetcher on scroll

  $('.chatBody').on('scroll', function() {
  var scrollTop = $(this).scrollTop();
  if (scrollTop <= 0) {
      var id = $(this).find('.msg-text').first().attr('data-id');
      var msg_id=$('.msg_id').val();
            $.ajax({
                url:base_url+'user/MsgFetcher',
                type:'POST',
                data:'id='+id+'&msg_id='+msg_id,
                success:function(data){
                  var tmp=data.split('--@--');
                    var $current_top_element = $('.msg_card_body').children().first();
                    $('.msg_card_body').prepend(tmp[2]);
                      $('.userProfile').css('background-image','url('+tmp[0]+')');
                      $('.adminProfie').css('background-image','url('+tmp[1]+')');
                    var previous_height = 0;
                    $current_top_element.prevAll().each(function() {
                      previous_height += $(this).outerHeight();
                    });
                    $('.chatBody').scrollTop(previous_height);
                }
            });
  		} 
	});

	 // Chat Msg Sending Function  
	  $('.msg_sender_trigger').click(function(e){
	  	    e.preventDefault();
            var msg=$('.msg_input').val();
            msg=$.trim(msg);
            if(msg==''){return false;}
            msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br>');
            var msg_id=$('.msg_id').val();
            $.ajax({
                url:base_url+'user/AjaxMsgSend',
                type:'POST',
                data:'msg='+msg+'&msg_id='+msg_id,
                success:function(data){
                    $('.msg_card_body').append(data);
                    $('.msg_input').val('');
                    $('.chatBody').scrollTop($('.chatBody').prop("scrollHeight"));
                }
            })
        });

	  // Chat File Upload
	   $('.file_sender_trigger').click(function(e){
	   	e.preventDefault();
      var data=new FormData($('#chatForm')[0]);
      $('.file_sender_trigger').addClass('hide');
      $('.file_uploading').removeClass('hide');
      $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url:base_url+'user/MsgFileUpload',
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
              var tmp=data.split('--@--');
              setTimeout(function(){
                  $('.file_sender_trigger').removeClass('hide');
                  $('.file_uploading').addClass('hide');
                  if(tmp[0]==1){
                      // $('.msg_card_body').append(tmp[1]);
                      $('.file_upload_success').removeClass('hide');
                      $('.file_upload_success').html('File Uploaded Successfully..');
                      setTimeout(function(){ $('.file_upload_success').addClass('hide'); }, 3000);
                      $('.chatBody').scrollTop($('.chatBody').prop("scrollHeight"));
                  }else{
                      $('.file_upload_error').removeClass('hide');
                      $('.file_upload_error').html(tmp[1]);
                      setTimeout(function(){ $('.file_upload_error').addClass('hide'); }, 3000);
                  }
                  $('#inputFile').val('');
                  $('.closeChooseFile').click();
              }, 3000);
          }
      });
  });

	 // File and Textarea Hidden
	 $(document).on('click','.chatChooseFile',function(){
	 	$('.chat-file-div').removeClass('hide');
	 	$('.chat-div').addClass('hide');
	 }); 

	 $(document).on('click','.closeChooseFile',function(){
	 	$('.chat-div').removeClass('hide');
	 	$('.chat-file-div').addClass('hide');
	 }); 

    function ChatBeat(){
     setInterval(function(){ 
            var id = $('.msg_card_body').find('.msg-text').last().attr('data-id');
            var msg_id=$('.msg_id').val();
            $.ajax({
                url:base_url+'user/RecentMsgFetcher',
                type:'POST',
                data:'id='+id+'&msg_id='+msg_id,
                success:function(data){
                    console.log(data);
                    var tmp=data.split('--@--');
                    if(tmp[0]==1){
            $('.msg_card_body').append(tmp[3]);
            $('.userProfile').css('background-image','url('+tmp[1]+')');
            $('.adminProfie').css('background-image','url('+tmp[2]+')');
            $('.chatBody').scrollTop($('.chatBody').prop("scrollHeight"));
                    }
                }
            });
          }, 5000);
   }

});  