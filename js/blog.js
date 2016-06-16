function addData(url, headerType, elementName, callback)
{
  return $.ajax({ 
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
        
        if (objData.CreatedDate) {
          blogData = blogData + "<h" + headerType + " class=\"uk-article-title\">" + objData.Title + "</h" + headerType + ">";
          blogData = blogData + "<p class=\"uk-text-muted\">" + objData.CreatedDate + "</p>";
          blogData = blogData + "<hr class=\"uk-article-divider\">";
        }
        else {
          blogData = blogData + "<h" + headerType + " class=\"uk-article-title\">" + objData.Title + "</h" + headerType + ">";
          blogData = blogData + "<hr class=\"uk-article-divider\">";
        }

        $.each(objData.Content, function(index, objContent) {
          if (objContent.Form) {
            var formData = "";
            
            formData = formData + "<form id=\"admissionForm\" class=\"uk-form uk-width-medium-1-2\"><fieldset>";
            
            $.each(objContent.Form, function(index, objFormContent) {
              formData = formData + "<div class=\"uk-form-row\"><div class=\"uk-form-controls\">";
              
              if (objFormContent.Textbox) {
                var textboxContent = objFormContent.Textbox;
                
                formData = formData + "<input id=\"" + textboxContent.ID + "\" name=\"" + textboxContent.ID + "\" type=\"text\" placeholder=\"" + textboxContent.Name + "\" class=\"uk-width-1-" + textboxContent.Width + "\">";
              }
              
              if (objFormContent.Dropdown) {
                var dropdownContent = objFormContent.Dropdown;
                
                formData = formData + "<select id=\"" + dropdownContent.ID + "\" name=\"" + dropdownContent.ID + "\" class=\"uk-width-1-" + dropdownContent.Width + "\">";
                formData = formData + "<option>-- Select " + dropdownContent.Name + "--</option>";
                
                $.each(dropdownContent.Option, function(index, objOptionValue) {
                  formData = formData + "<option value=\"" + objOptionValue.Value + "\">" + objOptionValue.Text + "</option>";
                });
                
                formData = formData + "</select>";
              }
              
              if (objFormContent.Button) {
                var buttonContent = objFormContent.Button;
                
                formData = formData + "<button id=\"" + buttonContent.ID + "\" name=\"" + buttonContent.ID + "\" class=\"uk-button\">" + buttonContent.Text + "</button>";                
              }
              
              if (objFormContent.Textarea) {
                var textareaContent = objFormContent.Textarea;
                
                formData = formData + "<textarea id=\"" + textareaContent.ID + "\" name=\"" + textareaContent.ID + "\" rows=\"" + textareaContent.Rows + "\" placeholder=\"" + textareaContent.Name + "\" class=\"uk-width-1-" + textareaContent.Width + "\"></textarea>";
              }
              
              formData = formData + "</div></div>";
            });
            
            formData = formData + "</fieldset></form>";
            blogData = blogData + formData;
          }
    
          if (objContent.Profile) {
            var profileData = ""; 
            var objProfileContent = objContent.Profile;
            
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

          if (objContent.Table) {
            var tableData = "<table class=\"uk-table uk-table-striped\"><thead>{{HEAD}}</thead>{{BODY}}<tbody></tbody></table>";
            var tableHead = "";
            var tableBody = "";
            
            tableHead = tableHead + "<tr>";
            
            $.each(objContent.Table.Header, function(childIndex, headerDetails) {
              tableHead = tableHead + "<th>" + headerDetails.Cell + "</th>";
            });
            
            tableHead = tableHead + "</tr>";

            $.each(objContent.Table.Rows, function(childIndex, row) {
              tableBody = tableBody + "<tr>";
              
              $.each(row.Row, function(childIndex, cell) {
                tableBody = tableBody + "<td>" + cell.Cell + "</td>";
              });
              
              tableBody = tableBody + "</tr>";
            });              

            tableData = tableData.replace('{{HEAD}}', tableHead);
            tableData = tableData.replace('{{BODY}}', tableBody);

            blogData = blogData + tableData;
          }
    
          if (objContent.Lists) {
            var listData = "";
            var listDescription = "<ul class=\"uk-list uk-list-striped\">{{LISTDATA}}</ul>";
            
            $.each(objContent.Lists, function(childIndex, lists) {
              if (lists.Header) {
                blogData = blogData + "<h2>" + lists.Header + "</h2>";
              }
              if (lists.Value) {
                listData = listData + "<li>" + lists.Value + "</li>";
              }
            });
            
            listDescription = listDescription.replace('{{LISTDATA}}', listData);
            blogData = blogData + listDescription;
          }
    
          if (objContent.HR) {
            blogData = blogData + "<hr class=\"uk-article-divider\">";
          }
        });

        blogData = blogData + "</article>";
      });
      
      callback(blogData);
      //blogContent.outerHTML = blogData;
    }
  });
}