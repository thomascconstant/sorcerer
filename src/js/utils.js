//GESTION DOM
function readStyle(elt,prop)
{
	var prop =  window.getComputedStyle(elt).getPropertyValue(prop);
	if(prop != prop)
		prop = 0;
	return prop;
}
