var folderNames = "json/folderNames.json";
var objEvents = [];

$(document).ready(function(){
  $.ajax({
    type: 'GET', 
    url: folderNames,
    dataType: "text",
    async: false,
    success: function(data) {
      var objFiles = jQuery.parseJSON(data);

      $.each(objFiles, function(index, objData) {
        GetAllEvents("json/" + objData.Name + "/fileDetails.json", function(eventData) {
          $.each(eventData, function(index, eventFiles) {
            var fileWithoutPath = eventFiles.Filename.split("/");
            
            objEvents.push({ "Name" : fileWithoutPath[2], "Path" : eventFiles.Filename});
          });          
        });                          
      });

      objEvents = objEvents.sort(sortByPropertyDecending('Name'));

      if (objEvents.length > 10) {
        objEvents = objEvents.slice(0,10);
      }

      AddEventData(objEvents);      
    }
  });    
});

function AddLatestNews() {
  $.ajax({
    type: 'GET', 
    url: "json/News/fileDetails.json",
    dataType: "text",
    async: false,
    success: function(data) {
      var objNews = jQuery.parseJSON(data);
      
      if (objNews.length > 10) {
        objNews = objNews.slice(0,10);
      }
         
      $.each(objNews, function(index, objData) {
        GetAllEvents(objData.Filename, function(newsData) {
          $.each(eventData, function(index, eventFiles) {
            var fileWithoutPath = eventFiles.Filename.split("/");
            
            objEvents.push({ "Name" : fileWithoutPath[2], "Path" : eventFiles.Filename});
          });          
        });                          
      });
    }
  });
}

function AddEventData(objEvents) {
  var latestEventData = "";
  var latestNewsData = "";
  
  var latestContent = document.getElementById("latestEvents");
  var latestNews = document.getElementById("latestNews");
  
  $.each(objEvents, function(index, eventFiles) {
    GetAllEvents(eventFiles.Path, function(eventData) {
      var isNewsSet = false;

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
  latestNews.innerHTML = latestNewsData;
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