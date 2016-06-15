$(document).ready(function(){
  var folderNames = "json/folderNames.json";
  
  $.ajax({
    type: 'GET', 
    url: folderNames,
    dataType: "text",
    async: false,
    success: function(data) {
      var objFiles = jQuery.parseJSON(data);
      var objEvents = new Array();
      var objNews = new Array();
      var objAll = new Array();
    
      $.each(objFiles, function(index, objData) {
        GetAllEvents("json/" + objData.Name + "/fileDetails.json", function(eventData) {
          $.each(eventData, function(index, eventFiles) {
            var fileWithoutPath = eventFiles.Filename.split("/");
            
            objAll.push({ "Name" : fileWithoutPath[2], "Path" : eventFiles.Filename});
          });          
        });                          
      });
      
      objNews = objAll.filter(function(i,n) {
        return i.Path.includes("News");
      });

      objNews = objNews.sort(sortByPropertyDecending('Name'));
      
      if (objNews.length > 5) {
        objNews = objNews.slice(0,5);
      }
      
      objEvents = objAll.filter(function(i,n) {
        return !(i.Path.includes("News"));
      });

      objEvents = objEvents.sort(sortByPropertyDecending('Name'));

      if (objEvents.length > 10) {
        objEvents = objEvents.slice(0,10);
      }

      var objAll = objEvents.concat(objNews);

      AddEventData(objAll);      
    }
  });    
});

function AddEventData(objEvents) {
  var latestNoticeData = "";
  var latestEventData = "";
  var latestNewsData = "";
  
  var latestContent = document.getElementById("latestEvents");
  var latestNotice = document.getElementById("notice");
  var latestNews = document.getElementById("latestNews");
  
  $.each(objEvents, function(index, eventFiles) {
    GetAllEvents(eventFiles.Path, function(eventData) {
      var isNewsSet = false;
      var isNoticeSet = false;

      $.each(eventData[0].Content, function(index, allFiles) {        
        if (eventFiles.Path.includes("News")) {
          if (allFiles.Paregraphs) {
            if (allFiles.Paregraphs[0].Text && !isNewsSet) {
              isNewsSet = true;
              
              latestNewsData = latestNewsData + "<li>";
              latestNewsData = latestNewsData + "<div style=\"max-height:235px;\" class=\"uk-panel\">";
              latestNewsData = latestNewsData + "<h3 class=\"uk-panel-title\">" + eventData[0].Title + "</h3>";
              latestNewsData = latestNewsData + allFiles.Paregraphs[0].Text + "</div></li>";
            }
          }
        }
        else if (eventFiles.Path.includes("Notice")) {
          if (allFiles.Paregraphs) {
            if (allFiles.Paregraphs[0].Text && !isNoticeSet) {
              isNoticeSet = true;
              
              latestNoticeData = latestNoticeData + "<li>";
              latestNoticeData = latestNoticeData + eventData[0].Title;
              latestNoticeData = latestNoticeData + "</li>";
            }
          }
        }
        else {
          if (allFiles.ImageURL) {
            var fileURL = eventFiles.Path.replace("json/", "");

            fileURL = fileURL.replace(".json", "");

            latestEventData = latestEventData + "<li>";
            latestEventData = latestEventData + "<img src=\"" + allFiles.ImageURL[0].URL + "\" width=\"800\" height=\"400\" alt=\"" + allFiles.ImageURL[0].ImageTitle + "\">";
            latestEventData = latestEventData + "<div class=\"uk-overlay-panel uk-overlay-background uk-overlay-bottom uk-overlay-slide-bottom\"><p>";
            latestEventData = latestEventData + eventData[0].Title;
            latestEventData = latestEventData + "</p><a target=\"_blank\" href=\"Main.html?JSON=" + fileURL + "\" class=\"uk-button uk-button-primary\">Read More</a></div></li>";                 
          }
        }
      });            
    });
  });
  
  latestContent.innerHTML = latestEventData;
  latestNotice.innerHTML = latestNoticeData;
  latestNews.innerHTML = latestNewsData;
  
  AddTestimonials();
}

function AddTestimonials() {
  var testimonialData = "";
  var testimonialContent = document.getElementById("testimonials");
  
  GetAllEvents("json/about_testimonials.json", function(testData) {
    $.each(testData[0].Content, function(index, allFiles) {        
      if (allFiles.Profile) {
        testimonialData = testimonialData + "<li>";
        testimonialData = testimonialData + "<h3>\"" + allFiles.Profile.Details[0].Paregraph + "\"</h3>";
        testimonialData = testimonialData + "<br><br><strong>" + allFiles.Profile.ProfileName + "</strong><br>";
        testimonialData = testimonialData + allFiles.Profile.Qualifications[0].Title
        testimonialData = testimonialData + "</li>";
      }
    });
  });
  
  testimonialContent.innerHTML = testimonialData;
}

var sortByPropertyDecending = function (property) {
  return function (x, y) {
    return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
  };
}

function GetAllEvents(fileName, callback) {
  $.ajax({
    type: 'GET', 
    url: fileName,
    dataType: "text",
    async: false,
    success: function(data) {
      callback(jQuery.parseJSON(data));        
    }
  });
}