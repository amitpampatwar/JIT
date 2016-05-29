$(document).ready(function(){
  addfooter();  
});

function addfooter()
{  
  $.ajax({ 
    type: 'GET', 
    url: './json/menu.json',
    dataType: "text",
    async: false,
    success: function (data) {
      var footer = document.getElementById('footerList');
      var objMenu = jQuery.parseJSON(data);
      var footerHTML = "";
      
      $.each(objMenu, function(index, objParent) {
        if (objParent.ChildNav !== undefined) {
          footerHTML = footerHTML + "<li class=\"uk-parent\"><a href=\"" + objParent.Link + "\">" + objParent.Name + "</a>";
          footerHTML = footerHTML + "<ul class=\"uk-nav-sub\">";
          
          $.each(objParent.ChildNav, function(childIndex, objChild) {
            if (objChild.SubChildNav !== undefined) {
              $.each(objChild.SubChildNav, function(subChildIndex, objSubChild) {
                footerHTML = footerHTML + "<li><a href=\"" + objSubChild.Link + "\">" + objSubChild.Name + "</a></li>";
              });
            }
            else {
              footerHTML = footerHTML + "<li><a href=\"" + objChild.Link + "\">" + objChild.Name + "</a></li>";
            }
          });

          footerHTML = footerHTML + "</ul></li>";
        }
        else {
          footerHTML = footerHTML + "<li class=\"uk-parent\"><a href=\"" + objParent.Link + "\">" + objParent.Name + "</a></li>";
        }
      });

      footer.innerHTML = footerHTML;
    }
  });
}