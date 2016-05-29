$(document).ready(function(){
  addHeader();  
});

function addHeader()
{
  $.ajax({ 
    type: 'GET', 
    url: './json/menu.json',
    dataType: "text",
    async: false,
    success: function (data) {
      var menuElement = ""; 
      var activeMenuLink = "";
      var objMenu = jQuery.parseJSON(data);
      var headerElement = document.getElementById('header');      
      var docname = document.location.href.match(/[^\/]+$/)[0];
      var navBar = "<nav class=\"tm-navbar uk-navbar uk-navbar-attached\" data-uk-sticky=\"{top:-100, animation: 'uk-animation-slide-top'}\">";
      
      navBar = navBar + "<div class=\"uk-container uk-container-center\">";
      navBar = navBar + "<a class=\"uk-navbar-brand uk-hidden-small\" href=\"./Default.html\"><img class=\"uk-margin uk-margin-remove\" src=\"images/SiteLogo.png\" width=\"40\" height=\"30\" title=\"JIT\" alt=\"JIT\"></a>";
      navBar = navBar + "<ul class=\"uk-navbar-nav uk-hidden-small\">";
      
      $.each(objMenu, function(index, objParent) {
        if (objParent.ChildNav !== undefined) {
          var isActiveLink = false;

          navBar = navBar + "<li class=\"uk-parent {{ACTIVELINK}}\" data-uk-dropdown=\"\" aria-haspopup=\"true\" aria-expanded=\"false\">";
          navBar = navBar + "<a href=\"\">" + objParent.Name + "</a>";
          navBar = navBar + "<div class=\"uk-dropdown uk-dropdown-navbar uk-dropdown-bottom\" style=\"top:40px;left:0px;\">";
          navBar = navBar + "<ul class=\"uk-nav uk-nav-navbar uk-nav-parent-icon\" data-uk-nav>";

          $.each(objParent.ChildNav, function(childIndex, objChild) {
            if (objChild.SubChildNav !== undefined) {
              navBar = navBar + "<li class=\"uk-parent\">";
              navBar = navBar + "<a href=\"#\">" + objChild.Name + "</a>";
              navBar = navBar + "<ul class=\"uk-nav-sub\">";

              $.each(objChild.SubChildNav, function(subChildIndex, objSubChild) {
                navBar = navBar + "<li><ul><li><a class=\"infoClass\" href=\"" + objSubChild.Link + "\">" + objSubChild.Name + "</a></li></ul></li>";

                if (docname == objSubChild.Link) {
                  activeMenuLink = docname;                  
                  isActiveLink = true;
                }
              });

              navBar = navBar + "</ul></li>";
            }
            else {
              if (docname == objChild.Link) {                
                activeMenuLink = docname;                
                isActiveLink = true;
              }
                            
              navBar = navBar + "<li><a class=\"infoClass\" href=\"" + objChild.Link + "\">" + objChild.Name + "</a></li>";                             
            }

            if (objChild.Divide) {
              navBar = navBar + "<li class=\"uk-nav-divider\"></li>";
            }
          });

          if (isActiveLink) {
            isActiveLink = false;
            menuElement = objParent.ChildNav;

            if (objParent.LeftNav) {
              menuElement = objParent.ChildNav;
            }

            navBar = navBar.replace("{{ACTIVELINK}}", "uk-active");
          }
          else {
            navBar = navBar.replace("{{ACTIVELINK}}", ""); 
          }

          navBar = navBar + "</ul></div></li>";
        }
        else {
          if (docname == objParent.Link) {
            navBar = navBar + "<li class=\"uk-active\"><a href=\"" + objParent.Link + "\">" + objParent.Name + "</a></li>";
          }
          else {
            navBar = navBar + "<li><a href=\"" + objParent.Link + "\">" + objParent.Name + "</a></li>"; 
          }

          if (objParent.LeftNav) {
            menuElement = objParent.LeftNav;
          }
        }
      });

      navBar = navBar + "</ul>";
      navBar = navBar + "<a href=\"#tm-offcanvas\" class=\"uk-navbar-toggle uk-visible-small\" data-uk-offcanvas=\"\"></a>";
      navBar = navBar + "<div class=\"uk-navbar-brand uk-navbar-center uk-visible-small\"><img src=\"images/SiteLogo.png\" width=\"40\" height=\"30\" title=\"JIT\" alt=\"JIT\"></div></div></nav>";
      
      headerElement.outerHTML = navBar;

      addSideBar(menuElement, activeMenuLink);
    }
  });
}

function addSideBar(menuElement, activeMenuLink) {
  var subMenuElement = document.getElementById('subMenu');

  if (subMenuElement != null) {
    var sideBar = "<div class=\"tm-sidebar uk-width-medium-1-4 uk-hidden-small uk-row-first\">";
    
    sideBar = sideBar + "<ul class=\"tm-nav uk-nav\">";

    $.each(menuElement, function(childIndex, objChild) {
      if (objChild.SubChildNav !== undefined) {
        sideBar = sideBar + "<li class=\"uk-nav-header\">" + objChild.Name + "</li>";
        
        $.each(objChild.SubChildNav, function(subChildIndex, objSubChild) {
          if (activeMenuLink == objSubChild.Link) {
            sideBar = sideBar + "<li class=\"uk-active\"><a href=\"" + objSubChild.Link + "\">" + objSubChild.Name + "</a></li>";
          }
          else {
            sideBar = sideBar + "<li><a href=\"" + objSubChild.Link + "\">" + objSubChild.Name + "</a></li>";
          }
        });
      }
      else {          
        if (activeMenuLink == objChild.Link) {
          sideBar = sideBar + "<li class=\"uk-active\"><a href=\"" + objChild.Link + "\">" + objChild.Name + "</a></li>";
        }
        else {
          sideBar = sideBar + "<li><a href=\"" + objChild.Link + "\">" + objChild.Name + "</a></li>";
        }
      }
    });

    sideBar = sideBar + "</ul></div>";
    subMenuElement.outerHTML = sideBar;
  }
}