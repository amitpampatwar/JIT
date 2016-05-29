$(document).ready(function(){
  addfooter();  
});

function addfooter(footer_image)
{  
  if ( document.getElementById )
  {
    var footer = document.getElementById ( 'footer' );

    if ( footer )
    {
      $.ajax({ 
        type: 'GET', 
        url: './contents/footer_contents.txt',
        dataType: "text",
        async: false,
        success: function (footer_contents) {
          if (footer_contents)
          {
            footer_contents = footer_contents.replace ('{{FooterImage}}', "images/SiteLogo.png" );
            footer_contents = footer_contents.replace ('{{DisplayFooterImage}}', 'block' );
            
            footer.outerHTML = footer_contents;
          }
        }
      });
    }
  }  
}