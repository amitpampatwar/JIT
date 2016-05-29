function addData(url, headerType, elementName)
{
  $.ajax({ 
    type: 'GET', 
    url: url,
    dataType: "text",
    async: false,
    success: function (data) {      
      var objBlog = jQuery.parseJSON(data);
      var blogContent = document.getElementById(elementName);
      var blogData = "";

      $.each(objBlog, function(index, objData) {
        blogData = blogData + "<article class=\"uk-article\">";
        blogData = blogData + "<h" + headerType + " class=\"uk-article-title\">" + objData.Title + "</h" + headerType + "><hr class=\"uk-article-divider\">";

        if (objData.CreatedDate) {
          blogData = blogData + "<p class=\"uk-text-muted uk-float-right\">" + objData.CreatedDate + "</p>";
        }

        $.each(objData.Content, function(index, objContent) {
          if (objContent.Profile) {
            var profileData = ""; 
            
            $.each(objContent.Profile, function(index, objProfileContent) {
              profileData = profileData + "<article class=\"uk-article\">";        
              profileData = profileData + "<header class=\"uk-comment-header\"><img class=\"uk-comment-avatar\" src=\"" + objProfileContent.ImageURL + "\" alt=\"" + objProfileContent.ImageTitle + "\">"
              profileData = profileData + "<h4 class=\"uk-comment-title\">" + objProfileContent.ProfileName + "</h4>";

              $.each(objProfileContent.Qualifications, function(childIndex, qualifications) {          
                profileData = profileData + "<div class=\"uk-comment-meta\">" + qualifications.Title + "</div>";
              });

              profileData = profileData + "</header>";

              $.each(objProfileContent.Details, function(childIndex, details) {
                if (details.Header) {
                  profileData = profileData + "<h2>" + details.Header + "</h2>";
                }
                profileData = profileData + "<div class=\"uk-comment-body uk-text-justify\">" + details.Paregraph + "</div>";
              });

              $.each(objProfileContent.Lists, function(childIndex, lists) {
                if (lists.Header) {
                  profileData = profileData + "<h2>" + lists.Header + "</h2><ul class=\"uk-list uk-list-striped\">";
                }
                if (lists.Value) {
                  profileData = profileData + "<li>" + lists.Value + "</li>";
                }
              });

              profileData = profileData + "</ul></article>";
              blogData = blogData + profileData;
            });
          }
    
          if (objContent.ImageURL) {
            blogData = blogData + "<ul class=\"uk-slideshow\" data-uk-slideshow=\"{autoplay:true}\">";

            $.each(objContent.ImageURL, function(childIndex, imageURL) {          
              blogData = blogData + "<li><img src=\"" + imageURL.URL + "\" width=\"800\" height=\"400\" alt=\"" + imageURL.ImageTitle + "\"></li>";
            });

            blogData = blogData + "</ul>";
          }

          if (objContent.Paregraphs) {
            $.each(objContent.Paregraphs, function(childIndex, paregraphs) {
              if (paregraphs.Text) {
                blogData = blogData + "<p class=\"uk-text-justify\">" + paregraphs.Text + "</p>";
              }
              else if (paregraphs.H1) {
                blogData = blogData + "<h1>" + paregraphs.H1 + "</h1>";
              }
              else if (paregraphs.H2) {
                blogData = blogData + "<h2>" + paregraphs.H2 + "</h2>";
              }
              else if (paregraphs.H3) {
                blogData = blogData + "<h3>" + paregraphs.H3 + "</h3>";
              }
              else if (paregraphs.H4) {
                blogData = blogData + "<h4>" + paregraphs.H4 + "</h4>";
              }
            });
          }

          if (objContent.Comment) {
            $.each(objContent.Paregraphs, function(childIndex, paregraphs) {          
              blogData = blogData + "<p class=\"uk-text-justify\">" + paregraphs.Text + "</p>";
            });
          }

          if (objContent.Table) {
            var tableData = "<table class=\"uk-table uk-table-striped\"><thead>{{HEAD}}</thead>{{BODY}}<tbody></tbody></table>";
            var tableHead = "";
            var tableBody = "";

            $.each(objContent.Table, function(childIndex, table) { 
              $.each(table.Header, function(childIndex, headerDetails) {
                tableHead = tableHead + "<th>" + headerDetails.Cell + "</th>";
              });

              $.each(table.Row, function(childIndex, cell) {
                tableBody = tableBody + "<td>" + cell.Cell + "</td>";
              });              
            });

            tableData = tableData.replace('{{HEAD}}', tableHead);
            tableData = tableData.replace('{{BODY}}', tableBody);

            blogData = blogData + tableData;
          }
        });

        blogData = blogData + "</article>";
      });

      blogContent.outerHTML = blogData;
    }
  });
}