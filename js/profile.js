function addProfileData(url, title, elementName)
{
  $.ajax({ 
    type: 'GET', 
    url: url,
    dataType: "text",
    async: false,
    success: function (data) {      
      var objProfile = jQuery.parseJSON(data);
      var profileContent = document.getElementById(elementName);
      var profileData = "";

      profileData = profileData + "<h1 class=\"uk-article-title\">" + title + "</h1><hr class=\"uk-article-divider\">";

      $.each(objProfile, function(index, objContent) {
        profileData = profileData + "<article class=\"uk-article\">";        
        profileData = profileData + "<header class=\"uk-comment-header\"><img class=\"uk-comment-avatar\" src=\"" + objContent.ImageURL + "\" alt=\"" + objContent.ImageTitle + "\">"
        profileData = profileData + "<h4 class=\"uk-comment-title\">" + objContent.ProfileName + "</h4>";

        $.each(objContent.Qualifications, function(childIndex, qualifications) {          
          profileData = profileData + "<div class=\"uk-comment-meta\">" + qualifications.Title + "</div>";
        });

        profileData = profileData + "</header>";

        $.each(objContent.Details, function(childIndex, details) {
          if (details.Header) {
            profileData = profileData + "<h2>" + details.Header + "</h2>";
          }
          profileData = profileData + "<div class=\"uk-comment-body uk-text-justify\">" + details.Paregraph + "</div>";
        });

        $.each(objContent.Lists, function(childIndex, lists) {
          if (lists.Header) {
            profileData = profileData + "<h2>" + lists.Header + "</h2><ul class=\"uk-list uk-list-striped\">";
          }
          if (lists.Value) {
            profileData = profileData + "<li>" + lists.Value + "</li>";
          }
        });

        profileData = profileData + "</ul></article>";
      });

      profileContent.outerHTML = profileData;
    }
  });
}