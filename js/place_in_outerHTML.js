function place_in_outerHTML (element, contents)
{
  if(element.outerHTML)
  {
    element.outerHTML = contents;
  }
  else
  {
    element.innerHTML = contents;    
  }
}
