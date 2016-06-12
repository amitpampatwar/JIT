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

      AddEventData(objEvents)
    }
  });    
});

function AddEventData(objEvents) {
  var latestEventData = "";
  var latestContent = document.getElementById("latestEvents");
  
  $.each(objEvents, function(index, eventFiles) {
    GetAllEvents(eventFiles.Path, function(eventData) {
      if (eventData.Content.ImageURL) {                
        latestEventData = latestEventData + "<li>";
        latestEventData = latestEventData + "<img src=\"" + eventData.Content.ImageURL.URL + "\" width=\"800\" height=\"400\" alt=\"" + eventData.Content.ImageURL.ImageTitle + "\">";
        latestEventData = latestEventData + "<div class=\"uk-overlay-panel uk-overlay-left uk-overlay-slide-left uk-width-1-3\"><p style=\"color:#fff;\" class=\"uk-panel-box uk-overlay-background\">";
        latestEventData = latestEventData + eventData.Title;
        latestEventData = latestEventData + "</p></div></li>";
      }
    });
  });
  
  latestContent.innerHTML = latestEventData;
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